import raw from './schemes_raw.json'
import type { CatalogScheme } from '../types'

interface RawData {
  categories: { name: string; targetGroup: string | null }[]
  schemes: CatalogScheme[]
}

const data = raw as RawData

export const CATALOG_SCHEMES: CatalogScheme[] = data.schemes
export const CATALOG_CATEGORIES: { name: string; targetGroup: string | null }[] = data.categories
