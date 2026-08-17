import { useMemo, useState } from 'react'
import { X, Search, ExternalLink, ChevronDown, MapPin, Atom } from 'lucide-react'
import { useLang } from '../context/useLang'
import { CATALOG_CATEGORIES } from '../data/catalog'
import type { ScoredCatalogScheme } from '../types'

const PAGE_SIZE = 20

function relevanceColor(score: number) {
  if (score >= 65) return 'text-success bg-success-soft'
  if (score >= 40) return 'text-warning bg-warning-soft'
  return 'text-text-faint bg-surface-2'
}

export function CatalogRow({ item, quantumPick = false }: { item: ScoredCatalogScheme; quantumPick?: boolean }) {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)
  const { scheme } = item

  return (
    <div className="border-b border-border last:border-b-0">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full cursor-pointer items-start gap-3 py-3 text-left">
        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${relevanceColor(item.relevanceScore)}`}>
          {item.relevanceScore}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-medium text-text">{scheme.name}</span>
            {quantumPick && (
              <span className="flex items-center gap-1 rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand">
                <Atom size={10} /> {t('quantumPick')}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-faint">
            <span>{scheme.ministry}</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              {scheme.level === 'state' ? <MapPin size={10} /> : null}
              {scheme.level === 'state' ? scheme.state : lang === 'en' ? 'Central' : lang === 'hi' ? 'केंद्रीय' : 'केंद्रीय'}
            </span>
          </div>
        </div>
        <ChevronDown size={16} className={`mt-2 shrink-0 text-text-faint transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="animate-fade-up mb-3 rounded-lg bg-surface-2/60 p-3 text-xs leading-relaxed">
          <div className="mb-1.5 font-semibold uppercase tracking-wide text-text-faint">{t('catalogTypicalEligibility')}</div>
          <p className="text-text-muted">{scheme.eligibilityRaw}</p>
          <p className="mt-2 text-text-faint">{t('catalogDisclaimer')}</p>
          <a
            href={`https://www.myscheme.gov.in/search/schemeName/${encodeURIComponent(scheme.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 font-medium text-brand hover:underline"
          >
            {t('catalogVerifyLink')} <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  )
}

export function CatalogBrowser({ scored, onClose }: { scored: ScoredCatalogScheme[]; onClose: () => void }) {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState<'all' | 'central' | 'state'>('all')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return scored.filter((item) => {
      if (q && !item.scheme.name.toLowerCase().includes(q) && !item.scheme.ministry.toLowerCase().includes(q)) return false
      if (category !== 'all' && item.scheme.category !== category) return false
      if (level === 'central' && item.scheme.level !== 'central') return false
      if (level === 'state' && item.scheme.level !== 'state') return false
      return true
    })
  }, [scored, search, category, level])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8" onClick={onClose}>
      <div
        className="animate-fade-up my-4 w-full max-w-2xl rounded-xl border border-border bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold text-text">{t('catalogTitle')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-text-faint">{t('catalogSubtitle')}</p>
          </div>
          <button onClick={onClose} className="shrink-0 cursor-pointer rounded-lg p-1.5 text-text-faint hover:bg-surface-2 hover:text-text">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              placeholder={t('catalogSearchPlaceholder')}
              className="w-full rounded-lg border border-border bg-surface py-2 pl-8 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(0)
            }}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="all">{t('catalogAllCategories')}</option>
            {CATALOG_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as 'all' | 'central' | 'state')
              setPage(0)
            }}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="all">{t('catalogAllLevels')}</option>
            <option value="central">{t('catalogCentralOnly')}</option>
            <option value="state">{t('catalogMyStateOnly')}</option>
          </select>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-5">
          {pageItems.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-faint">{t('catalogNoResults')}</p>
          ) : (
            pageItems.map((item) => <CatalogRow key={item.scheme.id} item={item} />)
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-4 text-xs text-text-faint">
          <span>
            {filtered.length} {t('catalogResultsCount')}
          </span>
          {pageCount > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="cursor-pointer font-medium text-brand disabled:cursor-not-allowed disabled:text-text-faint"
              >
                {t('catalogPrev')}
              </button>
              <span>
                {t('catalogPageOf')} {page + 1} / {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
                className="cursor-pointer font-medium text-brand disabled:cursor-not-allowed disabled:text-text-faint"
              >
                {t('catalogNext')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
