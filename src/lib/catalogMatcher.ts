import type { CatalogScheme, CategoryRule, ScoredCatalogScheme, UserProfile } from '../types'
import { CATEGORY_RULE_MAP } from '../data/categoryRules'

/**
 * Scores the 555-scheme reference catalog against a profile. Unlike
 * matcher.ts (hard eligibility filter on 14 fully-detailed schemes), this
 * produces a soft "typical fit" relevance score -- the source document is
 * explicit that its eligibility text is a category-wide pattern, not
 * verified per scheme, so we never claim a hard eligible/ineligible verdict
 * here. The one hard fact we do apply: a state scheme's target state either
 * matches the user's state or it doesn't.
 */

function signal(en: string, hi: string, mr: string) {
  return { en, hi, mr }
}

function scoreOne(profile: UserProfile, scheme: CatalogScheme, rule: CategoryRule | undefined): ScoredCatalogScheme {
  if (scheme.level === 'state' && scheme.state && scheme.state !== profile.state) {
    return { scheme, relevanceScore: 0, applicable: false, matchedSignals: [] }
  }

  if (!rule) {
    return { scheme, relevanceScore: 40, applicable: true, matchedSignals: [] }
  }

  let score = 45
  const signals: ScoredCatalogScheme['matchedSignals'] = []

  if (rule.occupations) {
    if (rule.occupations.includes(profile.occupation)) {
      score += 20
      signals.push(signal('Matches this category\'s typical target group', 'इस श्रेणी के विशिष्ट लक्ष्य समूह से मेल खाता है', 'या प्रवर्गाच्या ठराविक लक्ष्य गटाशी जुळते'))
    } else {
      score -= 15
    }
  }

  if (rule.minAge !== undefined && profile.age < rule.minAge) score -= 20
  if (rule.maxAge !== undefined && profile.age > rule.maxAge) score -= 15
  if ((rule.minAge !== undefined || rule.maxAge !== undefined) && !(rule.minAge !== undefined && profile.age < rule.minAge) && !(rule.maxAge !== undefined && profile.age > rule.maxAge)) {
    score += 10
    signals.push(signal('Within the typical age band for this category', 'इस श्रेणी की विशिष्ट आयु सीमा के भीतर', 'या प्रवर्गाच्या ठराविक वय मर्यादेत'))
  }

  if (rule.gender && profile.gender !== rule.gender) score -= 25
  if (rule.gender && profile.gender === rule.gender) {
    score += 15
    signals.push(signal('Matches this category\'s target gender group', 'इस श्रेणी के लक्ष्य लिंग समूह से मेल खाता है', 'या प्रवर्गाच्या लक्ष्य लिंग गटाशी जुळते'))
  }

  if (rule.requiresDisability) {
    if (profile.hasDisability) {
      score += 25
      signals.push(signal('You indicated a disability, matching this category', 'आपने दिव्यांगता बताई, जो इस श्रेणी से मेल खाती है', 'तुम्ही दिव्यांगत्व नमूद केले, जे या प्रवर्गाशी जुळते'))
    } else {
      score -= 40
    }
  }

  if (rule.maxIncomeTypical !== undefined) {
    if (profile.annualIncome <= rule.maxIncomeTypical) {
      score += 10
      signals.push(signal('Income is within the typical ceiling for this category', 'आय इस श्रेणी की विशिष्ट सीमा के भीतर है', 'उत्पन्न या प्रवर्गाच्या ठराविक मर्यादेत आहे'))
    } else {
      score -= 20
    }
  }

  if (rule.reservedCategories && rule.reservedCategories.includes(profile.category)) {
    score += 12
    signals.push(signal('Your social category is commonly prioritized here', 'आपकी सामाजिक श्रेणी को यहाँ आमतौर पर प्राथमिकता दी जाती है', 'तुमचा सामाजिक प्रवर्ग येथे सहसा प्राधान्य दिला जातो'))
  }

  if (rule.bplBoost && profile.isBPL) {
    score += 12
    signals.push(signal('BPL status is commonly prioritized in this category', 'BPL स्थिति को इस श्रेणी में आमतौर पर प्राथमिकता दी जाती है', 'BPL स्थितीला या प्रवर्गात सहसा प्राधान्य दिले जाते'))
  }

  if (rule.farmerLandBoost && profile.landHoldingAcres > 0 && profile.landHoldingAcres <= 5) {
    score += 12
    signals.push(signal('Small/marginal landholding is commonly prioritized', 'छोटी/सीमांत भूमि को आमतौर पर प्राथमिकता दी जाती है', 'लहान/अल्पभूधारक जमिनीला सहसा प्राधान्य दिले जाते'))
  }

  if (scheme.level === 'state') {
    score += 8
    signals.push(signal('State scheme available in your state', 'राज्य योजना आपके राज्य में उपलब्ध है', 'राज्य योजना तुमच्या राज्यात उपलब्ध आहे'))
  }

  return { scheme, relevanceScore: Math.max(0, Math.min(100, Math.round(score))), applicable: true, matchedSignals: signals }
}

export function scoreCatalog(profile: UserProfile, catalog: CatalogScheme[]): ScoredCatalogScheme[] {
  return catalog
    .map((s) => scoreOne(profile, s, CATEGORY_RULE_MAP[s.category]))
    .filter((s) => s.applicable)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
}
