import { useState } from 'react'
import { ArrowLeft, ArrowRight, User } from 'lucide-react'
import { useLang } from '../context/useLang'
import { StepIndicator } from './StepIndicator'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CATEGORY_LABELS, INDIAN_STATES, OCCUPATION_LABELS } from '../i18n/strings'
import type { Category, Gender, Occupation, UserProfile } from '../types'

const OCCUPATIONS: Occupation[] = ['farmer', 'student', 'unemployed', 'self-employed', 'salaried', 'daily-wage', 'senior-citizen', 'homemaker']
const CATEGORIES: Category[] = ['general', 'obc', 'sc', 'st', 'ews']

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 30,
  gender: 'male',
  annualIncome: 200000,
  occupation: 'farmer',
  state: 'Maharashtra',
  category: 'general',
  hasDisability: false,
  landHoldingAcres: 2,
  isBPL: false,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15'

function ToggleYesNo({ value, onChange, yes, no }: { value: boolean; onChange: (v: boolean) => void; yes: string; no: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[{ v: true, label: yes }, { v: false, label: no }].map((opt) => (
        <button
          key={String(opt.v)}
          type="button"
          onClick={() => onChange(opt.v)}
          className={`cursor-pointer rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
            value === opt.v ? 'border-brand bg-brand-soft text-brand' : 'border-border bg-surface text-text-muted hover:bg-surface-2'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function EligibilityForm({
  initial,
  onBack,
  onSubmit,
}: {
  initial: UserProfile | null
  onBack: () => void
  onSubmit: (profile: UserProfile) => void
}) {
  const { t, lang } = useLang()
  const [profile, setProfile] = useState<UserProfile>(initial ?? DEFAULT_PROFILE)

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => setProfile((p) => ({ ...p, [key]: value }))

  const canSubmit = profile.name.trim().length > 1 && profile.age > 0 && profile.age < 120

  return (
    <div className="min-h-full">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <button onClick={onBack} className="flex cursor-pointer items-center gap-1.5 text-sm text-text-muted hover:text-text">
          <ArrowLeft size={15} /> {t('back')}
        </button>
        <LanguageSwitcher />
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8"><StepIndicator step={1} /></div>

        <div className="animate-fade-up rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <User size={19} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t('step1Title')}</h2>
            </div>
          </div>

          <form
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (canSubmit) onSubmit(profile)
            }}
          >
            <div className="sm:col-span-2">
              <Field label={t('fieldName')}>
                <input
                  className={inputCls}
                  value={profile.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder={lang === 'en' ? 'e.g. Ramesh Kumar' : lang === 'hi' ? 'जैसे रमेश कुमार' : 'उदा. रमेश कुमार'}
                  required
                />
              </Field>
            </div>

            <Field label={t('fieldAge')}>
              <input
                type="number"
                min={1}
                max={119}
                className={inputCls}
                value={profile.age}
                onChange={(e) => update('age', Number(e.target.value))}
              />
            </Field>

            <Field label={t('fieldGender')}>
              <select className={inputCls} value={profile.gender} onChange={(e) => update('gender', e.target.value as Gender)}>
                <option value="male">{t('genderMale')}</option>
                <option value="female">{t('genderFemale')}</option>
                <option value="other">{t('genderOther')}</option>
              </select>
            </Field>

            <Field label={t('fieldIncome')}>
              <input
                type="number"
                min={0}
                step={1000}
                className={inputCls}
                value={profile.annualIncome}
                onChange={(e) => update('annualIncome', Number(e.target.value))}
              />
            </Field>

            <Field label={t('fieldOccupation')}>
              <select className={inputCls} value={profile.occupation} onChange={(e) => update('occupation', e.target.value as Occupation)}>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>
                    {OCCUPATION_LABELS[o][lang]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('fieldState')}>
              <select className={inputCls} value={profile.state} onChange={(e) => update('state', e.target.value)}>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('fieldCategory')}>
              <select className={inputCls} value={profile.category} onChange={(e) => update('category', e.target.value as Category)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c][lang]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('fieldLand')}>
              <input
                type="number"
                min={0}
                step={0.5}
                className={inputCls}
                value={profile.landHoldingAcres}
                onChange={(e) => update('landHoldingAcres', Number(e.target.value))}
              />
            </Field>

            <Field label={t('fieldDisability')}>
              <ToggleYesNo value={profile.hasDisability} onChange={(v) => update('hasDisability', v)} yes={t('yes')} no={t('no')} />
            </Field>

            <Field label={t('fieldBPL')}>
              <ToggleYesNo value={profile.isBPL} onChange={(v) => update('isBPL', v)} yes={t('yes')} no={t('no')} />
            </Field>

            <div className="mt-2 sm:col-span-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('next')}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
