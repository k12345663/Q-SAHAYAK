export type Lang = 'en' | 'hi' | 'mr'

export type Occupation =
  | 'farmer'
  | 'student'
  | 'unemployed'
  | 'self-employed'
  | 'salaried'
  | 'daily-wage'
  | 'senior-citizen'
  | 'homemaker'

export type Category = 'general' | 'obc' | 'sc' | 'st' | 'ews'
export type Gender = 'male' | 'female' | 'other'

export interface UserProfile {
  name: string
  age: number
  gender: Gender
  annualIncome: number
  occupation: Occupation
  state: string
  category: Category
  hasDisability: boolean
  landHoldingAcres: number
  isBPL: boolean
}

export type LocalizedText = Record<Lang, string>

export interface SchemeEligibility {
  minAge?: number
  maxAge?: number
  maxIncome?: number
  occupations?: Occupation[]
  categories?: Category[]
  states?: string[] // omit / empty = all states (central scheme)
  requiresDisability?: boolean
  maxLandHoldingAcres?: number
  requiresBPL?: boolean
  gender?: Gender
}

export interface Scheme {
  id: string
  name: LocalizedText
  department: LocalizedText
  level: 'central' | 'state'
  sector: 'agriculture' | 'health' | 'education' | 'housing' | 'employment' | 'social-security' | 'women-child' | 'finance'
  summary: LocalizedText
  benefits: LocalizedText
  eligibility: SchemeEligibility
  eligibilitySummary: LocalizedText
  requiredDocuments: string[] // doc type ids, resolved via i18n
  applicationSteps: LocalizedText[]
  officialUrl: string
}

export interface DocumentField {
  key: string
  label: string
  formValue: string
  extractedValue: string
  match: boolean
}

export interface UploadedDocument {
  id: string
  docType: string
  fileName: string
  status: 'pending' | 'processing' | 'verified' | 'mismatch'
  extractedFields: DocumentField[]
  confidence: number
}

export interface ScoredScheme {
  scheme: Scheme
  eligible: boolean
  matchScore: number // 0-100
  reasons: { text: LocalizedText; positive: boolean }[]
  failedHardFilters: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

/**
 * The 555-scheme reference catalog extracted from Government_Schemes_Full_Document.docx.
 * Unlike `Scheme`, these carry only what that document actually contains: name,
 * ministry, level/state, category, and a category-wide "typical" eligibility
 * description (explicitly NOT verified per-scheme in the source). No benefit
 * amounts, required documents, or application steps are fabricated for these.
 */
export interface CatalogScheme {
  id: string
  sno: string
  name: string
  ministry: string
  level: 'central' | 'state'
  state: string | null
  category: string
  eligibilityRaw: string
}

export interface CategoryRule {
  category: string
  occupations?: Occupation[]
  minAge?: number
  maxAge?: number
  maxIncomeTypical?: number
  gender?: Gender
  requiresDisability?: boolean
  bplBoost?: boolean
  reservedCategories?: Category[]
  farmerLandBoost?: boolean
  note: LocalizedText
}

export interface ScoredCatalogScheme {
  scheme: CatalogScheme
  relevanceScore: number // 0-100, a "typical fit" signal, not a verified eligibility determination
  applicable: boolean // false when a state scheme's state doesn't match the user's (a hard, certain fact)
  matchedSignals: LocalizedText[]
}
