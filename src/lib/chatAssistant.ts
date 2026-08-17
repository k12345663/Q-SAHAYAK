import type { Lang, ScoredScheme } from '../types'
import { DOC_TYPE_LABELS } from '../i18n/strings'

/**
 * Rule-based Q&A over the ranked scheme list — stands in for an LLM call
 * grounded via RAG over a scheme knowledge base. Keyword-matches the
 * question against scheme names/sectors and answers from structured data,
 * so responses never hallucinate scheme facts.
 */

function findScheme(question: string, ranked: ScoredScheme[], lang: Lang) {
  const q = question.toLowerCase()
  return ranked.find((r) => q.includes(r.scheme.id.replace(/-/g, ' ')) || q.includes(r.scheme.name[lang].toLowerCase()) || r.scheme.name.en.toLowerCase().split(' ').some((w) => w.length > 3 && q.includes(w.toLowerCase())))
}

const NO_MATCH: Record<Lang, string> = {
  en: "I can only answer questions about the schemes shown in your results. Try asking about a specific scheme, e.g. \"What documents do I need for PM-KISAN?\"",
  hi: 'मैं केवल आपके परिणामों में दिखाई गई योजनाओं के बारे में सवालों के जवाब दे सकता हूँ। किसी विशिष्ट योजना के बारे में पूछें।',
  mr: 'मी फक्त तुमच्या निकालांमध्ये दाखवलेल्या योजनांबद्दलच्या प्रश्नांची उत्तरे देऊ शकतो. एखाद्या विशिष्ट योजनेबद्दल विचारा.',
}

export function answerQuestion(question: string, ranked: ScoredScheme[], lang: Lang): string {
  const q = question.toLowerCase()
  const match = findScheme(question, ranked, lang)

  if (!match) return NO_MATCH[lang]

  const s = match.scheme

  if (q.includes('document') || q.includes('दस्तावेज़') || q.includes('कागदपत्र')) {
    const docs = s.requiredDocuments.map((d) => DOC_TYPE_LABELS[d]?.[lang] ?? d).join(', ')
    return lang === 'en'
      ? `For ${s.name.en}, you'll need: ${docs}.`
      : lang === 'hi'
        ? `${s.name.hi} के लिए, आपको चाहिए: ${docs}।`
        : `${s.name.mr} साठी, तुम्हाला लागेल: ${docs}.`
  }

  if (q.includes('benefit') || q.includes('लाभ') || q.includes('फायदे') || q.includes('money') || q.includes('amount')) {
    return `${s.name[lang]}: ${s.benefits[lang]}`
  }

  if (q.includes('apply') || q.includes('how') || q.includes('आवेदन') || q.includes('अर्ज') || q.includes('कैसे') || q.includes('कसा')) {
    const steps = s.applicationSteps.map((step, i) => `${i + 1}. ${step[lang]}`).join(' ')
    return `${s.name[lang]} — ${steps}`
  }

  if (q.includes('eligib') || q.includes('qualify') || q.includes('पात्र')) {
    return match.eligible
      ? `${s.name[lang]}: ${s.eligibilitySummary[lang]} Based on your profile, you appear eligible (${match.matchScore}% match).`
      : `${s.name[lang]}: ${s.eligibilitySummary[lang]} Based on your profile, you may not currently qualify — check the details on your results card.`
  }

  return `${s.name[lang]}: ${s.summary[lang]} ${s.benefits[lang]}`
}
