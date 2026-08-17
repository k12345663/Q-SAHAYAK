import type { Lang, LocalizedText } from '../types'

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
]

const dict = {
  appName: { en: 'QSahayak', hi: 'QSahayak', mr: 'QSahayak' },
  tagline: {
    en: 'AI-powered bridge to every government scheme you qualify for',
    hi: 'हर सरकारी योजना तक पहुँचने का AI-संचालित सेतु',
    mr: 'प्रत्येक पात्र सरकारी योजनेपर्यंत पोहोचण्याचा AI-आधारित सेतू',
  },
  heroHeading: {
    en: 'Find every government scheme you actually qualify for — in 2 minutes',
    hi: '2 मिनट में जानें आप किन-किन सरकारी योजनाओं के पात्र हैं',
    mr: '२ मिनिटांत तुम्ही कोणत्या सरकारी योजनांसाठी पात्र आहात ते शोधा',
  },
  heroSub: {
    en: 'Answer a few questions, upload your documents, and get a ranked, explained list of schemes — powered by a hybrid quantum-classical recommender, document AI, and a multilingual explanation engine.',
    hi: 'कुछ सवालों के जवाब दें, दस्तावेज़ अपलोड करें, और पाएं योजनाओं की एक क्रमबद्ध, समझाई गई सूची — हाइब्रिड क्वांटम-क्लासिकल अनुशंसा प्रणाली, डॉक्यूमेंट AI और बहुभाषी व्याख्या इंजन द्वारा संचालित।',
    mr: 'काही प्रश्नांची उत्तरे द्या, कागदपत्रे अपलोड करा, आणि मिळवा योजनांची क्रमवारीत लावलेली, स्पष्ट केलेली यादी — हायब्रिड क्वांटम-क्लासिकल शिफारस प्रणाली, डॉक्युमेंट AI आणि बहुभाषिक स्पष्टीकरण इंजिनद्वारे चालवली जाते.',
  },
  startButton: { en: 'Check my eligibility', hi: 'मेरी पात्रता जाँचें', mr: 'माझी पात्रता तपासा' },
  step1Title: { en: 'Your details', hi: 'आपका विवरण', mr: 'तुमचा तपशील' },
  step2Title: { en: 'Verify documents', hi: 'दस्तावेज़ सत्यापित करें', mr: 'कागदपत्रे सत्यापित करा' },
  step3Title: { en: 'Your recommended schemes', hi: 'आपके लिए अनुशंसित योजनाएँ', mr: 'तुमच्यासाठी शिफारस केलेल्या योजना' },
  fieldName: { en: 'Full name', hi: 'पूरा नाम', mr: 'पूर्ण नाव' },
  fieldAge: { en: 'Age', hi: 'आयु', mr: 'वय' },
  fieldGender: { en: 'Gender', hi: 'लिंग', mr: 'लिंग' },
  genderMale: { en: 'Male', hi: 'पुरुष', mr: 'पुरुष' },
  genderFemale: { en: 'Female', hi: 'महिला', mr: 'स्त्री' },
  genderOther: { en: 'Other', hi: 'अन्य', mr: 'इतर' },
  fieldIncome: { en: 'Annual family income (₹)', hi: 'वार्षिक पारिवारिक आय (₹)', mr: 'वार्षिक कौटुंबिक उत्पन्न (₹)' },
  fieldOccupation: { en: 'Occupation', hi: 'व्यवसाय', mr: 'व्यवसाय' },
  fieldState: { en: 'State', hi: 'राज्य', mr: 'राज्य' },
  fieldCategory: { en: 'Social category', hi: 'सामाजिक श्रेणी', mr: 'सामाजिक प्रवर्ग' },
  fieldDisability: { en: 'Person with disability', hi: 'दिव्यांग व्यक्ति', mr: 'दिव्यांग व्यक्ती' },
  fieldLand: { en: 'Agricultural land holding (acres)', hi: 'कृषि भूमि (एकड़ में)', mr: 'शेतजमीन (एकर)' },
  fieldBPL: { en: 'Below Poverty Line (BPL) card holder', hi: 'गरीबी रेखा से नीचे (BPL) कार्डधारक', mr: 'दारिद्र्यरेषेखालील (BPL) कार्डधारक' },
  yes: { en: 'Yes', hi: 'हाँ', mr: 'होय' },
  no: { en: 'No', hi: 'नहीं', mr: 'नाही' },
  next: { en: 'Continue', hi: 'आगे बढ़ें', mr: 'पुढे जा' },
  back: { en: 'Back', hi: 'पीछे', mr: 'मागे' },
  skipDocs: { en: 'Skip document upload for now', hi: 'अभी दस्तावेज़ अपलोड छोड़ें', mr: 'सध्या कागदपत्रे अपलोड करणे वगळा' },
  viewResults: { en: 'View my schemes', hi: 'मेरी योजनाएँ देखें', mr: 'माझ्या योजना पहा' },
  uploadPrompt: {
    en: 'Upload your documents so our Vision-Language Model can verify them and cross-check against the details you entered.',
    hi: 'अपने दस्तावेज़ अपलोड करें ताकि हमारा विज़न-लैंग्वेज मॉडल उन्हें सत्यापित कर सके और आपके द्वारा दी गई जानकारी से मिलान कर सके।',
    mr: 'तुमची कागदपत्रे अपलोड करा जेणेकरून आमचे व्हिजन-लँग्वेज मॉडेल त्यांची पडताळणी करू शकेल आणि तुम्ही दिलेल्या माहितीशी जुळवू शकेल.',
  },
  dragDrop: { en: 'Click or drag a file here to upload', hi: 'फ़ाइल अपलोड करने के लिए क्लिक करें या यहाँ खींचें', mr: 'फाइल अपलोड करण्यासाठी क्लिक करा किंवा येथे ड्रॅग करा' },
  processing: { en: 'Reading document with VLM…', hi: 'VLM द्वारा दस्तावेज़ पढ़ा जा रहा है…', mr: 'VLM द्वारे कागदपत्र वाचले जात आहे…' },
  verified: { en: 'Verified — matches your form', hi: 'सत्यापित — आपके फॉर्म से मेल खाता है', mr: 'सत्यापित — तुमच्या फॉर्मशी जुळते' },
  mismatch: { en: 'Mismatch found — please review', hi: 'बेमेल पाया गया — कृपया जाँचें', mr: 'जुळत नाही — कृपया तपासा' },
  matchScore: { en: 'Match score', hi: 'मिलान स्कोर', mr: 'जुळणी गुण' },
  eligible: { en: 'Eligible', hi: 'पात्र', mr: 'पात्र' },
  borderline: { en: 'Not currently eligible', hi: 'वर्तमान में पात्र नहीं', mr: 'सध्या पात्र नाही' },
  benefits: { en: 'Benefits', hi: 'लाभ', mr: 'फायदे' },
  whyEligible: { en: 'Why you may qualify', hi: 'आप क्यों पात्र हो सकते हैं', mr: 'तुम्ही का पात्र असू शकता' },
  requiredDocs: { en: 'Required documents', hi: 'आवश्यक दस्तावेज़', mr: 'आवश्यक कागदपत्रे' },
  howToApply: { en: 'How to apply', hi: 'आवेदन कैसे करें', mr: 'अर्ज कसा करावा' },
  officialLink: { en: 'Official scheme page', hi: 'आधिकारिक योजना पृष्ठ', mr: 'अधिकृत योजना पृष्ठ' },
  noSchemes: { en: 'No strongly matching schemes yet — try adjusting your details.', hi: 'अभी कोई मजबूत मेल खाने वाली योजना नहीं — विवरण समायोजित करें।', mr: 'अजून कोणतीही जुळणारी योजना नाही — तपशील बदलून पहा.' },
  askAI: { en: 'Ask a question about your schemes', hi: 'अपनी योजनाओं के बारे में सवाल पूछें', mr: 'तुमच्या योजनांबद्दल प्रश्न विचारा' },
  chatPlaceholder: { en: 'e.g. What documents do I need for PM-KISAN?', hi: 'जैसे, PM-KISAN के लिए मुझे कौन से दस्तावेज़ चाहिए?', mr: 'उदा. PM-KISAN साठी मला कोणती कागदपत्रे लागतील?' },
  send: { en: 'Send', hi: 'भेजें', mr: 'पाठवा' },
  startOver: { en: 'Start over', hi: 'फिर से शुरू करें', mr: 'पुन्हा सुरू करा' },
  howItWorks: { en: 'How it works', hi: 'यह कैसे काम करता है', mr: 'हे कसे कार्य करते' },
  step1How: { en: 'Tell us about yourself', hi: 'अपने बारे में बताएं', mr: 'स्वतःबद्दल सांगा' },
  step2How: { en: 'Upload documents for AI verification', hi: 'AI सत्यापन के लिए दस्तावेज़ अपलोड करें', mr: 'AI पडताळणीसाठी कागदपत्रे अपलोड करा' },
  step3How: { en: 'Get ranked, explained recommendations', hi: 'क्रमबद्ध, समझाई गई सिफारिशें प्राप्त करें', mr: 'क्रमवारी लावलेल्या, स्पष्ट केलेल्या शिफारसी मिळवा' },
  poweredBy: { en: 'Hybrid quantum-classical ranking · Vision-Language document verification · Multilingual LLM explanations', hi: 'हाइब्रिड क्वांटम-क्लासिकल रैंकिंग · विज़न-लैंग्वेज दस्तावेज़ सत्यापन · बहुभाषी LLM व्याख्याएँ', mr: 'हायब्रिड क्वांटम-क्लासिकल रँकिंग · व्हिजन-लँग्वेज कागदपत्र पडताळणी · बहुभाषिक LLM स्पष्टीकरणे' },
  schemesFound: { en: 'schemes matched', hi: 'योजनाएँ मिलीं', mr: 'योजना जुळल्या' },
  quantumLoading: { en: 'Running QAOA optimization on Qiskit…', hi: 'Qiskit पर QAOA अनुकूलन चल रहा है…', mr: 'Qiskit वर QAOA ऑप्टिमायझेशन सुरू आहे…' },
  quantumFallback: { en: 'Quantum backend unavailable — showing classical ranking', hi: 'क्वांटम बैकएंड अनुपलब्ध — क्लासिकल रैंकिंग दिखाई जा रही है', mr: 'क्वांटम बॅकएंड अनुपलब्ध — क्लासिकल रँकिंग दाखवत आहे' },
  quantumPick: { en: 'Quantum-optimized pick', hi: 'क्वांटम-अनुकूलित चयन', mr: 'क्वांटम-ऑप्टिमाइझ्ड निवड' },
  quantumTruncated: { en: 'capped for the simulator', hi: 'सिम्युलेटर के लिए सीमित', mr: 'सिम्युलेटरसाठी मर्यादित' },
  catalogTitle: { en: 'Full scheme catalog', hi: 'पूर्ण योजना सूची', mr: 'संपूर्ण योजना सूची' },
  catalogSubtitle: {
    en: '555 central & state schemes from the government reference database — matched by typical category patterns, not individually verified.',
    hi: '555 केंद्रीय और राज्य योजनाएँ सरकारी संदर्भ डेटाबेस से — विशिष्ट श्रेणी पैटर्न द्वारा मिलान, व्यक्तिगत रूप से सत्यापित नहीं।',
    mr: '555 केंद्रीय व राज्य योजना सरकारी संदर्भ डेटाबेसमधून — ठराविक प्रवर्ग पॅटर्ननुसार जुळणी, वैयक्तिकरित्या सत्यापित नाही.',
  },
  catalogTopMatches: { en: 'Top catalog matches for you', hi: 'आपके लिए शीर्ष सूची मिलान', mr: 'तुमच्यासाठी शीर्ष सूची जुळणी' },
  catalogBrowseAll: { en: 'Browse all 555 schemes', hi: 'सभी 555 योजनाएँ ब्राउज़ करें', mr: 'सर्व 555 योजना ब्राउझ करा' },
  catalogSearchPlaceholder: { en: 'Search scheme name or ministry…', hi: 'योजना का नाम या मंत्रालय खोजें…', mr: 'योजनेचे नाव किंवा मंत्रालय शोधा…' },
  catalogAllCategories: { en: 'All categories', hi: 'सभी श्रेणियाँ', mr: 'सर्व प्रवर्ग' },
  catalogAllLevels: { en: 'Central + State', hi: 'केंद्रीय + राज्य', mr: 'केंद्रीय + राज्य' },
  catalogCentralOnly: { en: 'Central only', hi: 'केवल केंद्रीय', mr: 'फक्त केंद्रीय' },
  catalogMyStateOnly: { en: 'My state only', hi: 'केवल मेरा राज्य', mr: 'फक्त माझे राज्य' },
  catalogResultsCount: { en: 'schemes', hi: 'योजनाएँ', mr: 'योजना' },
  catalogTypicalEligibility: { en: 'Typical eligibility', hi: 'विशिष्ट पात्रता', mr: 'ठराविक पात्रता' },
  catalogDisclaimer: {
    en: 'Category-level pattern, not verified per scheme. Confirm exact criteria on myscheme.gov.in before applying.',
    hi: 'श्रेणी-स्तरीय पैटर्न, प्रति योजना सत्यापित नहीं। आवेदन से पहले myscheme.gov.in पर सटीक मानदंड की पुष्टि करें।',
    mr: 'प्रवर्ग-स्तरीय पॅटर्न, प्रति योजना सत्यापित नाही. अर्ज करण्यापूर्वी myscheme.gov.in वर अचूक निकष तपासा.',
  },
  catalogVerifyLink: { en: 'Search on myscheme.gov.in', hi: 'myscheme.gov.in पर खोजें', mr: 'myscheme.gov.in वर शोधा' },
  catalogNoResults: { en: 'No schemes match your search.', hi: 'आपकी खोज से कोई योजना मेल नहीं खाती।', mr: 'तुमच्या शोधाशी कोणतीही योजना जुळत नाही.' },
  catalogClose: { en: 'Close', hi: 'बंद करें', mr: 'बंद करा' },
  catalogPrev: { en: 'Previous', hi: 'पिछला', mr: 'मागील' },
  catalogNext: { en: 'Next', hi: 'अगला', mr: 'पुढील' },
  catalogPageOf: { en: 'Page', hi: 'पृष्ठ', mr: 'पान' },
} satisfies Record<string, LocalizedText>

export type StringKey = keyof typeof dict

export function t(key: StringKey, lang: Lang): string {
  return dict[key][lang]
}

export const DOC_TYPE_LABELS: Record<string, LocalizedText> = {
  aadhaar: { en: 'Aadhaar Card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
  income: { en: 'Income Certificate', hi: 'आय प्रमाण पत्र', mr: 'उत्पन्नाचा दाखला' },
  caste: { en: 'Caste Certificate', hi: 'जाति प्रमाण पत्र', mr: 'जात प्रमाणपत्र' },
  landRecord: { en: '7/12 Land Record (Extract)', hi: 'भूमि रिकॉर्ड (7/12 उतारा)', mr: '७/१२ उतारा' },
  bankPassbook: { en: 'Bank Passbook', hi: 'बैंक पासबुक', mr: 'बँक पासबुक' },
  marksheet: { en: 'Latest Marksheet', hi: 'नवीनतम मार्कशीट', mr: 'नवीनतम गुणपत्रिका' },
  disabilityCert: { en: 'Disability Certificate (UDID)', hi: 'दिव्यांगता प्रमाण पत्र (UDID)', mr: 'दिव्यांगत्व प्रमाणपत्र (UDID)' },
  bplCard: { en: 'BPL Ration Card', hi: 'BPL राशन कार्ड', mr: 'BPL रेशन कार्ड' },
  domicile: { en: 'Domicile / Residence Certificate', hi: 'निवास प्रमाण पत्र', mr: 'रहिवासी दाखला' },
  photo: { en: 'Passport Size Photo', hi: 'पासपोर्ट साइज़ फोटो', mr: 'पासपोर्ट आकाराचा फोटो' },
}

export const OCCUPATION_LABELS: Record<string, LocalizedText> = {
  farmer: { en: 'Farmer', hi: 'किसान', mr: 'शेतकरी' },
  student: { en: 'Student', hi: 'छात्र', mr: 'विद्यार्थी' },
  unemployed: { en: 'Unemployed', hi: 'बेरोजगार', mr: 'बेरोजगार' },
  'self-employed': { en: 'Self-employed / Small business', hi: 'स्व-नियोजित / छोटा व्यवसाय', mr: 'स्वयंरोजगार / लहान व्यवसाय' },
  salaried: { en: 'Salaried employee', hi: 'वेतनभोगी कर्मचारी', mr: 'पगारदार कर्मचारी' },
  'daily-wage': { en: 'Daily-wage worker', hi: 'दिहाड़ी मजदूर', mr: 'रोजंदारी कामगार' },
  'senior-citizen': { en: 'Senior citizen / Retired', hi: 'वरिष्ठ नागरिक / सेवानिवृत्त', mr: 'ज्येष्ठ नागरिक / निवृत्त' },
  homemaker: { en: 'Homemaker', hi: 'गृहिणी', mr: 'गृहिणी' },
}

export const CATEGORY_LABELS: Record<string, LocalizedText> = {
  general: { en: 'General', hi: 'सामान्य', mr: 'खुला प्रवर्ग' },
  obc: { en: 'OBC', hi: 'OBC', mr: 'OBC' },
  sc: { en: 'SC', hi: 'SC', mr: 'SC' },
  st: { en: 'ST', hi: 'ST', mr: 'ST' },
  ews: { en: 'EWS', hi: 'EWS', mr: 'EWS' },
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
]
