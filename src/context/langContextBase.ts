import { createContext } from 'react'
import type { Lang } from '../types'
import type { StringKey } from '../i18n/strings'

export interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: StringKey) => string
}

export const LangContext = createContext<LangContextValue | null>(null)
