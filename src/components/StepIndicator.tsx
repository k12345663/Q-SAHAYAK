import { Check } from 'lucide-react'
import { useLang } from '../context/useLang'

export function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const { t } = useLang()
  const steps = [
    { n: 1, label: t('step1Title') },
    { n: 2, label: t('step2Title') },
    { n: 3, label: t('step3Title') },
  ]

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                step > s.n
                  ? 'bg-success text-white'
                  : step === s.n
                    ? 'bg-brand text-white'
                    : 'bg-surface-2 text-text-faint'
              }`}
            >
              {step > s.n ? <Check size={14} /> : s.n}
            </div>
            <span className={`hidden text-sm sm:inline ${step === s.n ? 'font-medium text-text' : 'text-text-faint'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && <div className="h-px w-6 bg-border sm:w-10" />}
        </div>
      ))}
    </div>
  )
}
