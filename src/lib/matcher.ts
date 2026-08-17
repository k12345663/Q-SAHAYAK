import type { LocalizedText, Scheme, ScoredScheme, UserProfile } from '../types'
import { OCCUPATION_LABELS } from '../i18n/strings'

/**
 * Eligibility & ranking engine.
 *
 * Stage 1 (classical, hard filter): every scheme is checked against the
 * user's profile on the criteria that are non-negotiable (age, income
 * ceiling, category, occupation, ...). This mirrors the "classical
 * preprocessing" stage of the proposed hybrid architecture.
 *
 * Stage 2 (weighted objective): for the schemes that clear stage 1, each
 * criterion is scored 0..1 based on how comfortably the user clears it
 * (e.g. income far below the ceiling scores higher than income right at
 * the edge). In the full system this per-scheme objective vector is what
 * gets encoded as a QUBO and optimized with QAOA on a Qiskit Aer
 * simulator; this prototype computes the equivalent weighted-sum ranking
 * classically since no quantum backend is wired up here.
 */

const fmtINR = (n: number) => `₹${n.toLocaleString('en-IN')}`

function reason(en: string, hi: string, mr: string, positive: boolean) {
  return { text: { en, hi, mr } as LocalizedText, positive }
}

const OCC_LABEL = OCCUPATION_LABELS

interface Criterion {
  pass: boolean
  weight: number
  score01: number // how comfortably it's met, 0..1 (only meaningful when pass=true)
  reason: { text: LocalizedText; positive: boolean }
}

function evaluate(profile: UserProfile, scheme: Scheme): Criterion[] {
  const e = scheme.eligibility
  const c: Criterion[] = []

  if (e.minAge !== undefined || e.maxAge !== undefined) {
    const min = e.minAge ?? 0
    const max = e.maxAge ?? 120
    const pass = profile.age >= min && profile.age <= max
    const mid = (min + max) / 2
    const span = Math.max(1, max - min)
    const score01 = pass ? 1 - Math.min(1, Math.abs(profile.age - mid) / span) * 0.4 : 0
    const range = e.maxAge !== undefined && e.minAge !== undefined ? `${min}–${max}` : e.minAge !== undefined ? `${min}+` : `≤${max}`
    c.push({
      pass, weight: 1.2, score01,
      reason: pass
        ? reason(`Your age (${profile.age}) is within the required range (${range}).`, `आपकी आयु (${profile.age}) आवश्यक सीमा (${range}) के भीतर है।`, `तुमचे वय (${profile.age}) आवश्यक श्रेणीत (${range}) आहे.`, true)
        : reason(`This scheme requires age ${range}; your age (${profile.age}) is outside this range.`, `इस योजना के लिए आयु ${range} आवश्यक है; आपकी आयु (${profile.age}) इस सीमा से बाहर है।`, `या योजनेसाठी वय ${range} आवश्यक आहे; तुमचे वय (${profile.age}) या श्रेणीबाहेर आहे.`, false),
    })
  }

  if (e.maxIncome !== undefined) {
    const pass = profile.annualIncome <= e.maxIncome
    const ratio = profile.annualIncome / e.maxIncome
    const score01 = pass ? 1 - Math.min(1, ratio) * 0.5 : 0
    c.push({
      pass, weight: 1.5, score01,
      reason: pass
        ? reason(`Your annual income (${fmtINR(profile.annualIncome)}) is within the ${fmtINR(e.maxIncome)} limit.`, `आपकी वार्षिक आय (${fmtINR(profile.annualIncome)}) ${fmtINR(e.maxIncome)} की सीमा के भीतर है।`, `तुमचे वार्षिक उत्पन्न (${fmtINR(profile.annualIncome)}) ${fmtINR(e.maxIncome)} च्या मर्यादेत आहे.`, true)
        : reason(`Your annual income (${fmtINR(profile.annualIncome)}) exceeds this scheme's ${fmtINR(e.maxIncome)} limit.`, `आपकी वार्षिक आय (${fmtINR(profile.annualIncome)}) इस योजना की ${fmtINR(e.maxIncome)} सीमा से अधिक है।`, `तुमचे वार्षिक उत्पन्न (${fmtINR(profile.annualIncome)}) या योजनेच्या ${fmtINR(e.maxIncome)} मर्यादेपेक्षा जास्त आहे.`, false),
    })
  }

  if (e.occupations && e.occupations.length > 0) {
    const pass = e.occupations.includes(profile.occupation)
    const label = (OCC_LABEL[profile.occupation]?.en ?? profile.occupation).toLowerCase()
    c.push({
      pass, weight: 1.4, score01: pass ? 1 : 0,
      reason: pass
        ? reason(`You are registered as a ${label}, matching this scheme's target group.`, `आप ${OCC_LABEL[profile.occupation]?.hi} के रूप में पंजीकृत हैं, जो इस योजना के लक्ष्य समूह से मेल खाता है।`, `तुम्ही ${OCC_LABEL[profile.occupation]?.mr} म्हणून नोंदणीकृत आहात, जे या योजनेच्या लक्ष्य गटाशी जुळते.`, true)
        : reason(`This scheme targets specific occupations that don't include "${label}".`, `यह योजना विशिष्ट व्यवसायों को लक्षित करती है जिनमें "${label}" शामिल नहीं है।`, `ही योजना विशिष्ट व्यवसायांना लक्ष्य करते ज्यात "${label}" समाविष्ट नाही.`, false),
    })
  }

  if (e.categories && e.categories.length > 0) {
    const pass = e.categories.includes(profile.category)
    c.push({
      pass, weight: 1.3, score01: pass ? 1 : 0,
      reason: pass
        ? reason(`Your social category (${profile.category.toUpperCase()}) qualifies for this scheme.`, `आपकी सामाजिक श्रेणी (${profile.category.toUpperCase()}) इस योजना के लिए योग्य है।`, `तुमचा सामाजिक प्रवर्ग (${profile.category.toUpperCase()}) या योजनेसाठी पात्र आहे.`, true)
        : reason(`This scheme is restricted to specific social categories that don't include yours (${profile.category.toUpperCase()}).`, `यह योजना विशिष्ट सामाजिक श्रेणियों तक सीमित है जिसमें आपकी (${profile.category.toUpperCase()}) शामिल नहीं है।`, `ही योजना विशिष्ट सामाजिक प्रवर्गांपुरती मर्यादित आहे ज्यात तुमचा (${profile.category.toUpperCase()}) समाविष्ट नाही.`, false),
    })
  }

  if (e.states && e.states.length > 0) {
    const pass = e.states.includes(profile.state)
    c.push({
      pass, weight: 1, score01: pass ? 1 : 0,
      reason: pass
        ? reason(`This scheme is available in your state (${profile.state}).`, `यह योजना आपके राज्य (${profile.state}) में उपलब्ध है।`, `ही योजना तुमच्या राज्यात (${profile.state}) उपलब्ध आहे.`, true)
        : reason(`This scheme isn't offered in your state (${profile.state}).`, `यह योजना आपके राज्य (${profile.state}) में उपलब्ध नहीं है।`, `ही योजना तुमच्या राज्यात (${profile.state}) उपलब्ध नाही.`, false),
    })
  }

  if (e.requiresDisability) {
    const pass = profile.hasDisability
    c.push({
      pass, weight: 1.3, score01: pass ? 1 : 0,
      reason: pass
        ? reason(`This scheme is for persons with disabilities, which matches your profile.`, `यह योजना दिव्यांग व्यक्तियों के लिए है, जो आपकी प्रोफ़ाइल से मेल खाती है।`, `ही योजना दिव्यांग व्यक्तींसाठी आहे, जी तुमच्या प्रोफाइलशी जुळते.`, true)
        : reason(`This scheme is exclusively for persons with disabilities.`, `यह योजना विशेष रूप से दिव्यांग व्यक्तियों के लिए है।`, `ही योजना विशेषतः दिव्यांग व्यक्तींसाठी आहे.`, false),
    })
  }

  if (e.maxLandHoldingAcres !== undefined) {
    const pass = profile.landHoldingAcres <= e.maxLandHoldingAcres && profile.landHoldingAcres > 0
    const score01 = pass ? 1 - Math.min(1, profile.landHoldingAcres / e.maxLandHoldingAcres) * 0.3 : 0
    c.push({
      pass, weight: 1.2, score01,
      reason: pass
        ? reason(`Your land holding (${profile.landHoldingAcres} acres) is within the ${e.maxLandHoldingAcres}-acre limit.`, `आपकी भूमि (${profile.landHoldingAcres} एकड़) ${e.maxLandHoldingAcres} एकड़ की सीमा के भीतर है।`, `तुमची जमीन (${profile.landHoldingAcres} एकर) ${e.maxLandHoldingAcres} एकर मर्यादेत आहे.`, true)
        : reason(`This scheme requires cultivable landholding up to ${e.maxLandHoldingAcres} acres.`, `इस योजना के लिए ${e.maxLandHoldingAcres} एकड़ तक कृषि भूमि आवश्यक है।`, `या योजनेसाठी ${e.maxLandHoldingAcres} एकरपर्यंत शेतजमीन आवश्यक आहे.`, false),
    })
  }

  if (e.requiresBPL) {
    const pass = profile.isBPL
    c.push({
      pass, weight: 1.2, score01: pass ? 1 : 0,
      reason: pass
        ? reason(`You hold a BPL card, which this scheme requires.`, `आपके पास BPL कार्ड है, जो इस योजना के लिए आवश्यक है।`, `तुमच्याकडे BPL कार्ड आहे, जे या योजनेसाठी आवश्यक आहे.`, true)
        : reason(`This scheme is restricted to BPL card holders.`, `यह योजना BPL कार्डधारकों तक सीमित है।`, `ही योजना BPL कार्डधारकांपुरती मर्यादित आहे.`, false),
    })
  }

  if (e.gender) {
    const pass = profile.gender === e.gender
    c.push({
      pass, weight: 1.1, score01: pass ? 1 : 0,
      reason: pass
        ? reason(`This scheme is designed for your gender group.`, `यह योजना आपके लिंग समूह के लिए बनाई गई है।`, `ही योजना तुमच्या लिंग गटासाठी तयार केली आहे.`, true)
        : reason(`This scheme is restricted to a different gender group.`, `यह योजना एक अलग लिंग समूह तक सीमित है।`, `ही योजना वेगळ्या लिंग गटापुरती मर्यादित आहे.`, false),
    })
  }

  return c
}

export function scoreScheme(profile: UserProfile, scheme: Scheme): ScoredScheme {
  const criteria = evaluate(profile, scheme)
  const failed = criteria.filter((c) => !c.pass)
  const eligible = failed.length === 0

  let matchScore: number
  if (criteria.length === 0) {
    matchScore = 85
  } else if (eligible) {
    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0)
    const weightedAvg = criteria.reduce((s, c) => s + c.weight * c.score01, 0) / totalWeight
    matchScore = Math.round(55 + weightedAvg * 44)
  } else {
    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0)
    const failedWeight = failed.reduce((s, c) => s + c.weight, 0)
    matchScore = Math.round(Math.max(5, 40 * (1 - failedWeight / totalWeight)))
  }

  return {
    scheme,
    eligible,
    matchScore,
    reasons: criteria.map((c) => c.reason),
    failedHardFilters: failed.map((c) => c.reason.text.en),
  }
}

export function rankSchemes(profile: UserProfile, schemes: Scheme[]): ScoredScheme[] {
  return schemes
    .map((s) => scoreScheme(profile, s))
    .sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1
      return b.matchScore - a.matchScore
    })
}
