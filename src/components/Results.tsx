import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, RotateCcw, Cpu, Loader2, AlertTriangle, LayoutGrid } from 'lucide-react'
import { useLang } from '../context/useLang'
import { StepIndicator } from './StepIndicator'
import { LanguageSwitcher } from './LanguageSwitcher'
import { SchemeCard } from './SchemeCard'
import { ChatWidget } from './ChatWidget'
import { CatalogBrowser, CatalogRow } from './CatalogBrowser'
import { rankSchemes } from '../lib/matcher'
import { scoreCatalog } from '../lib/catalogMatcher'
import { runQuantumOptimization, type QuantumCandidate, type QuantumStatus } from '../lib/quantumRanker'
import { resolveCuratedCategory } from '../data/sectorCategoryMap'
import { SCHEMES } from '../data/schemes'
import { CATALOG_SCHEMES } from '../data/catalog'
import type { UserProfile } from '../types'

const TOP_K = 5
const CATALOG_MIN_RELEVANCE = 45
const CATALOG_TOP_N = 6

export function Results({ profile, onBack, onStartOver }: { profile: UserProfile; onBack: () => void; onStartOver: () => void }) {
  const { t, lang } = useLang()
  const ranked = useMemo(() => rankSchemes(profile, SCHEMES), [profile])
  const eligible = ranked.filter((r) => r.eligible)
  const others = ranked.filter((r) => !r.eligible).slice(0, 4)

  const catalogScored = useMemo(() => scoreCatalog(profile, CATALOG_SCHEMES), [profile])
  const catalogTopMatches = catalogScored.filter((c) => c.relevanceScore >= CATALOG_MIN_RELEVANCE).slice(0, CATALOG_TOP_N)
  const [catalogOpen, setCatalogOpen] = useState(false)

  const [quantum, setQuantum] = useState<QuantumStatus>({ state: 'idle' })

  useEffect(() => {
    let cancelled = false
    setQuantum({ state: 'loading' })

    const curatedCandidates: QuantumCandidate[] = eligible.map((s) => ({
      id: s.scheme.id,
      score: s.matchScore,
      category: resolveCuratedCategory(s.scheme.id, s.scheme.sector),
    }))
    const catalogCandidates: QuantumCandidate[] = catalogTopMatches.map((c) => ({
      id: c.scheme.id,
      score: c.relevanceScore,
      category: c.scheme.category,
    }))

    runQuantumOptimization([...curatedCandidates, ...catalogCandidates], TOP_K).then((result) => {
      if (cancelled) return
      setQuantum(result ? { state: 'success', result } : { state: 'unavailable' })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const selectedIds = quantum.state === 'success' ? new Set(quantum.result.selected) : null
  const orderedEligible = selectedIds
    ? [...eligible].sort((a, b) => {
        const aSel = selectedIds.has(a.scheme.id) ? 0 : 1
        const bSel = selectedIds.has(b.scheme.id) ? 0 : 1
        return aSel !== bSel ? aSel - bSel : b.matchScore - a.matchScore
      })
    : eligible

  const totalCandidateCount = eligible.length + catalogTopMatches.length

  return (
    <div className="min-h-full">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <button onClick={onBack} className="flex cursor-pointer items-center gap-1.5 text-sm text-text-muted hover:text-text">
          <ArrowLeft size={15} /> {t('back')}
        </button>
        <LanguageSwitcher />
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8"><StepIndicator step={3} /></div>

        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-semibold">
            {t('step3Title')}, {profile.name.split(' ')[0]}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-text-faint">
            <span>{eligible.length} {t('schemesFound')}</span>
            {totalCandidateCount > 0 && <span className="text-border">·</span>}
            {quantum.state === 'loading' && totalCandidateCount > 0 && (
              <span className="flex items-center gap-1">
                <Loader2 size={12} className="animate-spin text-brand" /> {t('quantumLoading')}
              </span>
            )}
            {quantum.state === 'success' && (
              <span className="flex items-center gap-1" title={`objective-tuned via ${quantum.result.optimizer} on ${quantum.result.backend}`}>
                <Cpu size={12} className="text-brand" />
                QAOA · {quantum.result.numQubits} qubits · {quantum.result.reps} rep{quantum.result.reps > 1 ? 's' : ''} · {Math.round(quantum.result.elapsedMs)}ms
                {quantum.result.truncated && ` (${t('quantumTruncated')})`}
              </span>
            )}
            {quantum.state === 'unavailable' && totalCandidateCount > 0 && (
              <span className="flex items-center gap-1 text-warning">
                <AlertTriangle size={12} /> {t('quantumFallback')}
              </span>
            )}
          </div>
        </div>

        {eligible.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-surface-2/50 p-8 text-center text-sm text-text-muted">
            {t('noSchemes')}
          </div>
        )}

        <div className="space-y-3">
          {orderedEligible.map((s, i) => (
            <SchemeCard key={s.scheme.id} scored={s} index={i} quantumPick={selectedIds?.has(s.scheme.id) ?? false} />
          ))}
        </div>

        {others.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-faint">
              {{ en: 'Other schemes (not currently eligible)', hi: 'अन्य योजनाएँ (वर्तमान में पात्र नहीं)', mr: 'इतर योजना (सध्या पात्र नाही)' }[lang]}
            </div>
            <div className="space-y-3 opacity-70">
              {others.map((s, i) => (
                <SchemeCard key={s.scheme.id} scored={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {catalogTopMatches.length > 0 && (
          <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-text">{t('catalogTopMatches')}</h3>
              <button
                onClick={() => setCatalogOpen(true)}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-medium text-brand hover:underline"
              >
                <LayoutGrid size={12} /> {t('catalogBrowseAll')}
              </button>
            </div>
            <p className="mb-2 text-xs text-text-faint">{t('catalogDisclaimer')}</p>
            <div>
              {catalogTopMatches.map((item) => (
                <CatalogRow key={item.scheme.id} item={item} quantumPick={selectedIds?.has(item.scheme.id) ?? false} />
              ))}
            </div>
          </div>
        )}

        {catalogTopMatches.length === 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setCatalogOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-brand hover:underline"
            >
              <LayoutGrid size={12} /> {t('catalogBrowseAll')}
            </button>
          </div>
        )}

        <div className="mt-8">
          <ChatWidget ranked={ranked} />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartOver}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-text-muted hover:text-text"
          >
            <RotateCcw size={14} /> {t('startOver')}
          </button>
        </div>
      </main>

      {catalogOpen && <CatalogBrowser scored={catalogScored} onClose={() => setCatalogOpen(false)} />}
    </div>
  )
}
