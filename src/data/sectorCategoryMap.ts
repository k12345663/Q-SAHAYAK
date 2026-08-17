import type { Scheme } from '../types'

/** Maps the 14 curated schemes onto the 555-scheme catalog's category names,
 * so redundancy detection can group curated and catalog candidates together
 * regardless of which tier they came from. Falls back to a coarse
 * sector->category map, with explicit per-scheme overrides where the
 * `sector` enum is too coarse (e.g. 'social-security' covers both pension
 * and LPG-connection schemes). */
const SECTOR_TO_CATEGORY: Record<Scheme['sector'], string> = {
  agriculture: 'Agriculture & Farmers Welfare',
  health: 'Health & Wellness',
  education: 'Student / Education & Scholarships',
  housing: 'Housing & Shelter',
  employment: 'Employment & Skill Development',
  'social-security': 'Senior Citizen & Pension',
  'women-child': 'Women & Child Development',
  finance: 'Business & Entrepreneurship / MSME',
}

const SCHEME_ID_CATEGORY_OVERRIDES: Record<string, string> = {
  ujjwala: 'Utility, Energy & Sanitation',
  ddrs: 'Disability / Divyangjan Welfare',
}

export function resolveCuratedCategory(schemeId: string, sector: Scheme['sector']): string {
  return SCHEME_ID_CATEGORY_OVERRIDES[schemeId] ?? SECTOR_TO_CATEGORY[sector]
}
