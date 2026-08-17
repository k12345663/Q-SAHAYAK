import { SCHEME_CONFLICTS } from '../data/conflicts'

const API_URL = import.meta.env.VITE_QUANTUM_API_URL ?? 'http://localhost:8000'
const REQUEST_TIMEOUT_MS = 8000
const MAX_SENT_CANDIDATES = 12 // backend truncates further to its own qubit ceiling; this just bounds payload size

export interface QuantumCandidate {
  id: string
  score: number // 0-100
  category: string // used only for dynamic redundancy grouping, not sent to the backend
}

export interface QuantumRankResult {
  selected: string[]
  conflictsAvoided: [string, string][]
  numQubits: number
  reps: number
  optimizer: string
  backend: string
  elapsedMs: number
  truncated: boolean
}

export type QuantumStatus =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'success'; result: QuantumRankResult }
  | { state: 'unavailable' }

/**
 * Redundancy conflicts, generalized beyond a fixed list of scheme IDs: any
 * two candidates in the same catalog/sector category are treated as a soft
 * conflict (recommending five near-identical pension schemes together is as
 * redundant as recommending APY alongside PMSYM). Works over any candidate
 * set -- the original 14 curated schemes, the 555-scheme catalog, or a mix
 * of both -- not just a hardcoded pair.
 */
function deriveConflicts(candidates: QuantumCandidate[]): [string, string][] {
  const byCategory = new Map<string, string[]>()
  for (const c of candidates) {
    const list = byCategory.get(c.category) ?? []
    list.push(c.id)
    byCategory.set(c.category, list)
  }

  const conflicts = new Set<string>()
  const pairs: [string, string][] = []
  for (const ids of byCategory.values()) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = [ids[i], ids[j]].sort().join('|')
        if (!conflicts.has(key)) {
          conflicts.add(key)
          pairs.push([ids[i], ids[j]])
        }
      }
    }
  }

  for (const [a, b] of SCHEME_CONFLICTS) {
    const key = [a, b].sort().join('|')
    if (!conflicts.has(key)) {
      conflicts.add(key)
      pairs.push([a, b])
    }
  }

  return pairs
}

/**
 * Calls the QAOA ranking service (see backend/main.py) to pick the best
 * non-redundant subset of candidate schemes to highlight. Returns null if
 * the backend is unreachable or times out -- callers should fall back to
 * classical order rather than block on this.
 */
export async function runQuantumOptimization(candidates: QuantumCandidate[], topK: number): Promise<QuantumRankResult | null> {
  if (candidates.length === 0) return null

  const trimmed = [...candidates].sort((a, b) => b.score - a.score).slice(0, MAX_SENT_CANDIDATES)
  const conflicts = deriveConflicts(trimmed)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(`${API_URL}/api/rank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        schemes: trimmed.map((c) => ({ id: c.id, score: c.score })),
        conflicts,
        top_k: topK,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      selected: data.selected,
      conflictsAvoided: data.conflicts_avoided,
      numQubits: data.num_qubits,
      reps: data.reps,
      optimizer: data.optimizer,
      backend: data.backend,
      elapsedMs: data.elapsed_ms,
      truncated: data.truncated,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}
