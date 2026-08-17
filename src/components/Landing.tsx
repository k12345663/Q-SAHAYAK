import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { useLang } from '../context/useLang'
import { LanguageSwitcher } from './LanguageSwitcher'
import { SCHEMES } from '../data/schemes'

export function Landing({ onStart }: { onStart: () => void }) {
  const { t, lang } = useLang()

  const howItWorks = [
    { title: t('step1How'), desc: { en: 'A short form on income, occupation, category, and more.', hi: 'आय, व्यवसाय, श्रेणी आदि पर एक छोटा फॉर्म।', mr: 'उत्पन्न, व्यवसाय, प्रवर्ग इत्यादींवर एक छोटा फॉर्म.' }[lang] },
    { title: t('step2How'), desc: { en: 'Our Vision-Language Model reads and cross-checks your documents.', hi: 'हमारा विज़न-लैंग्वेज मॉडल आपके दस्तावेज़ पढ़ता और जाँचता है।', mr: 'आमचे व्हिजन-लँग्वेज मॉडेल तुमची कागदपत्रे वाचते आणि तपासते.' }[lang] },
    { title: t('step3How'), desc: { en: 'A ranked list with plain-language reasons for each scheme.', hi: 'प्रत्येक योजना के लिए सरल भाषा में कारणों के साथ एक क्रमबद्ध सूची।', mr: 'प्रत्येक योजनेसाठी सोप्या भाषेत कारणांसह क्रमवारी लावलेली यादी.' }[lang] },
  ]

  const previewReasons =
    lang === 'en'
      ? ['Landholding farmer family (2 acres)', 'Cultivable land within 12.5-acre limit']
      : lang === 'hi'
        ? ['भूमिधारक किसान परिवार (2 एकड़)', 'कृषि भूमि 12.5 एकड़ की सीमा के भीतर']
        : ['जमीनधारक शेतकरी कुटुंब (2 एकर)', 'शेतजमीन 12.5 एकर मर्यादेत']

  return (
    <div className="min-h-full">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[17px] font-bold tracking-tight text-text">{t('appName')}</span>
            <span className="mb-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-14 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted">
              <ShieldCheck size={13} className="text-brand" />
              {t('poweredBy')}
            </div>
            <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-balance text-text sm:text-[2.75rem]">
              {t('heroHeading')}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-muted sm:text-base">{t('heroSub')}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-strong"
              >
                {t('startButton')}
                <ArrowRight size={16} />
              </button>
              <span className="text-xs text-text-faint">
                {SCHEMES.length}+ {lang === 'en' ? 'central schemes in the demo database' : lang === 'hi' ? 'केंद्रीय योजनाएँ डेमो डेटाबेस में' : 'केंद्रीय योजना डेमो डेटाबेसमध्ये'}
              </span>
            </div>
          </div>

          <div className="animate-fade-up rounded-xl border border-border bg-surface p-5 shadow-md" style={{ animationDelay: '90ms' }}>
            <div className="mb-4 flex items-center justify-between text-xs font-medium text-text-faint">
              <span>{lang === 'en' ? 'Sample result' : lang === 'hi' ? 'नमूना परिणाम' : 'नमुना निकाल'}</span>
              <span className="rounded-full bg-success-soft px-2 py-0.5 text-success">{t('eligible')}</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 shrink-0">
                <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
                  <circle cx="22" cy="22" r="19" strokeWidth="4" className="fill-none stroke-border" />
                  <circle cx="22" cy="22" r="19" strokeWidth="4" strokeLinecap="round" className="fill-none stroke-success" strokeDasharray={2 * Math.PI * 19} strokeDashoffset={2 * Math.PI * 19 * 0.06} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-success">94</div>
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-text">PM-KISAN Samman Nidhi</div>
                <div className="text-xs text-text-faint">Ministry of Agriculture &amp; Farmers Welfare</div>
                <div className="mt-1 text-sm text-text-muted">₹6,000/year · 3 installments</div>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 border-t border-border pt-4">
              {previewReasons.map((r) => (
                <div key={r} className="flex items-start gap-2 text-[13px] text-text-muted">
                  <Check size={14} className="mt-0.5 shrink-0 text-success" />
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-border pt-12">
          <h2 className="mb-8 text-lg font-semibold text-text">{t('howItWorks')}</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {howItWorks.map((s, i) => (
              <div key={i} className="animate-fade-up flex gap-3.5" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand text-xs font-semibold text-brand">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-text">{s.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
