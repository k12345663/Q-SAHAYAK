"""
Quantum-classical hybrid ranking service.

Stage 1 (classical, done in the frontend): hard-filter schemes against the
user's profile and score each eligible scheme 0-100 on how comfortably it's
matched. See src/lib/matcher.ts.

Stage 2 (this service): given the eligible schemes' scores plus known
redundant/conflicting pairs, select the best subset of ~top_k schemes to
surface as "optimized picks" -- maximize total benefit score while avoiding
recommending two redundant schemes together and preferring a subset close to
top_k in size. This is a genuine combinatorial selection problem (a QUBO),
solved here with QAOA run on Qiskit's statevector simulator.

It is intentionally not "just sort by score": the conflict and cardinality
penalty terms create cross-variable interactions that a plain sort can't
resolve, which is what makes handing it to an optimizer meaningful.
"""

import time
from itertools import combinations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qiskit.primitives import StatevectorSampler
from qiskit_algorithms import QAOA
from qiskit_algorithms.optimizers import COBYLA
from qiskit_algorithms.utils import algorithm_globals
from qiskit_optimization import QuadraticProgram
from qiskit_optimization.algorithms import MinimumEigenOptimizer

app = FastAPI(title="QSahayak Quantum Ranking Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_CANDIDATES = 7  # statevector simulation cost is O(2^n); keeps solves interactive
CONFLICT_PENALTY = 1.4
CARDINALITY_PENALTY = 0.35
QAOA_REPS = 1
COBYLA_MAXITER = 40


class SchemeInput(BaseModel):
    id: str
    score: float  # 0-100, from the classical eligibility stage


class RankRequest(BaseModel):
    schemes: list[SchemeInput]
    conflicts: list[tuple[str, str]] = []
    top_k: int = 5


class RankResponse(BaseModel):
    selected: list[str]
    conflicts_considered: list[tuple[str, str]]
    conflicts_avoided: list[tuple[str, str]]
    objective_value: float
    num_qubits: int
    reps: int
    optimizer: str
    backend: str
    elapsed_ms: float
    truncated: bool


def build_qubo(ids: list[str], scores: dict[str, float], conflicts: list[tuple[str, str]], k: int) -> QuadraticProgram:
    qp = QuadraticProgram("scheme_selection")
    for sid in ids:
        qp.binary_var(name=sid)

    linear: dict[str, float] = {sid: -scores[sid] / 100.0 for sid in ids}
    quadratic: dict[tuple[str, str], float] = {}

    for a, b in conflicts:
        if a in scores and b in scores:
            quadratic[(a, b)] = quadratic.get((a, b), 0.0) + CONFLICT_PENALTY

    # Soft cardinality target: CARDINALITY_PENALTY * (sum(x) - k)^2, expanded.
    for sid in ids:
        linear[sid] = linear.get(sid, 0.0) + CARDINALITY_PENALTY * (1 - 2 * k)
    for a, b in combinations(ids, 2):
        quadratic[(a, b)] = quadratic.get((a, b), 0.0) + 2 * CARDINALITY_PENALTY

    qp.minimize(linear=linear, quadratic=quadratic)
    return qp


@app.post("/api/rank", response_model=RankResponse)
def rank(req: RankRequest) -> RankResponse:
    start = time.perf_counter()

    algorithm_globals.random_seed = 42

    candidates = sorted(req.schemes, key=lambda s: s.score, reverse=True)
    truncated = len(candidates) > MAX_CANDIDATES
    candidates = candidates[:MAX_CANDIDATES]

    ids = [s.id for s in candidates]
    scores = {s.id: s.score for s in candidates}
    conflicts = [(a, b) for a, b in req.conflicts if a in scores and b in scores]
    k = max(1, min(req.top_k, len(ids)))

    qp = build_qubo(ids, scores, conflicts, k)

    sampler = StatevectorSampler()
    qaoa = QAOA(sampler=sampler, optimizer=COBYLA(maxiter=COBYLA_MAXITER), reps=QAOA_REPS)
    result = MinimumEigenOptimizer(qaoa).solve(qp)

    selected = [qp.variables[i].name for i, v in enumerate(result.x) if v > 0.5]
    selected_set = set(selected)

    elapsed_ms = (time.perf_counter() - start) * 1000

    return RankResponse(
        selected=selected,
        conflicts_considered=conflicts,
        conflicts_avoided=[(a, b) for a, b in conflicts if not (a in selected_set and b in selected_set)],
        objective_value=float(result.fval),
        num_qubits=len(ids),
        reps=QAOA_REPS,
        optimizer="COBYLA",
        backend="qiskit-statevector-sampler",
        elapsed_ms=round(elapsed_ms, 1),
        truncated=truncated,
    )


@app.get("/api/health")
def health() -> dict[str, bool]:
    return {"ok": True}
