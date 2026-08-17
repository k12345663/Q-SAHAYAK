import { useMemo, useState, type ReactNode } from 'react'
import type { Lang } from '../types'
import { t as translate, type StringKey } from '../i18n/strings'
import { LangContext, type LangContextValue } from './langContextBase'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: (key: StringKey) => translate(key, lang) }),
    [lang],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
