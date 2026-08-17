import { Languages } from 'lucide-react'
import { useLang } from '../context/useLang'
import { LANGUAGES } from '../i18n/strings'

export function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-1.5 py-1 shadow-sm">
      <Languages size={15} className="ml-1 text-text-faint" />
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
            lang === l.code ? 'bg-brand text-white' : 'text-text-muted hover:bg-surface-2'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
