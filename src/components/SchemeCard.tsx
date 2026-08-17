import { useState } from 'react'
import {
  ChevronDown, ExternalLink, Sprout, HeartPulse, GraduationCap, Home,
  Briefcase, ShieldCheck, Users, Landmark, CheckCircle2, XCircle, FileText, Atom,
} from 'lucide-react'
import { useLang } from '../context/useLang'
import { DOC_TYPE_LABELS } from '../i18n/strings'
import type { ScoredScheme } from '../types'

const SECTOR_ICON: Record<string, React.ElementType> = {
  agriculture: Sprout,
  health: HeartPulse,
  education: GraduationCap,
  housing: Home,
  employment: Briefcase,
  'social-security': ShieldCheck,
  'women-child': Users,
  finance: Landmark,
}

function scoreColor(score: number, eligible: boolean) {
  if (!eligible) return { ring: 'stroke-danger', text: 'text-danger', bg: 'bg-danger-soft' }
  if (score >= 85) return { ring: 'stroke-success', text: 'text-success', bg: 'bg-success-soft' }
  return { ring: 'stroke-warning', text: 'text-warning', bg: 'bg-warning-soft' }
}

function ScoreRing({ score, eligible }: { score: number; eligible: boolean }) {
  const c = scoreColor(score, eligible)
  const r = 19
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
        <circle cx="22" cy="22" r={r} strokeWidth="4" className="fill-none stroke-border" />
        <circle
          cx="22" cy="22" r={r} strokeWidth="4" strokeLinecap="round"
          className={`fill-none transition-all duration-700 ${c.ring}`}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-[13px] font-semibold ${c.text}`}>{score}</div>
    </div>
  )
}

export function SchemeCard({ scored, index, quantumPick = false }: { scored: ScoredScheme; index: number; quantumPick?: boolean }) {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(index === 0 && scored.eligible)
  const { scheme, eligible, matchScore, reasons } = scored
  const Icon = SECTOR_ICON[scheme.sector] ?? Landmark
  const c = scoreColor(matchScore, eligible)

  return (
    <div
      className="animate-fade-up overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <button onClick={() => setOpen((o) => !o)} className="flex w-full cursor-pointer items-start gap-4 p-5 text-left">
        <ScoreRing score={matchScore} eligible={eligible} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-soft text-brand"><Icon size={13} /></div>
            <h3 className="text-[15px] font-semibold">{scheme.name[lang]}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${c.bg} ${c.text}`}>
              {eligible ? t('eligible') : t('borderline')}
            </span>
            {quantumPick && (
              <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand">
                <Atom size={11} /> {t('quantumPick')}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-text-faint">{scheme.department[lang]}</div>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{scheme.summary[lang]}</p>
        </div>

        <ChevronDown size={18} className={`mt-2 shrink-0 text-text-faint transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="animate-fade-up space-y-5 border-t border-border bg-surface-2/50 p-5">
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-faint">{t('benefits')}</div>
            <p className="text-sm leading-relaxed text-text">{scheme.benefits[lang]}</p>
          </div>

          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-faint">{t('whyEligible')}</div>
            <ul className="space-y-1.5">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                  {r.positive ? (
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
                  ) : (
                    <XCircle size={15} className="mt-0.5 shrink-0 text-danger" />
                  )}
                  <span className={r.positive ? 'text-text' : 'text-text-muted'}>{r.text[lang]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-faint">{t('requiredDocs')}</div>
            <div className="flex flex-wrap gap-1.5">
              {scheme.requiredDocuments.map((d) => (
                <span key={d} className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-muted">
                  <FileText size={11} /> {DOC_TYPE_LABELS[d]?.[lang] ?? d}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-faint">{t('howToApply')}</div>
            <ol className="space-y-1.5">
              {scheme.applicationSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-text">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[10px] font-semibold text-brand">{i + 1}</span>
                  {step[lang]}
                </li>
              ))}
            </ol>
          </div>

          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            {t('officialLink')} <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  )
}
