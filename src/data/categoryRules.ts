import type { CategoryRule } from '../types'

/**
 * One rule per category from the 555-scheme reference document. These encode
 * the document's own "typical criteria" paragraphs as soft scoring signals,
 * not hard eligibility gates -- the source document itself states these are
 * category-wide patterns, not verified per scheme. A state-scheme domicile
 * mismatch is the one thing treated as a hard fact (see catalogMatcher.ts).
 */
export const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Student / Education & Scholarships',
    occupations: ['student'],
    maxIncomeTypical: 800000,
    reservedCategories: ['sc', 'st', 'obc', 'ews'],
    note: {
      en: 'Enrolled students; family income typically under ₹1–8 lakh/yr depending on the scheme; category and merit-based reservations common.',
      hi: 'नामांकित छात्र; योजना अनुसार पारिवारिक आय आमतौर पर ₹1–8 लाख/वर्ष से कम; श्रेणी और योग्यता आधारित आरक्षण सामान्य।',
      mr: 'नोंदणीकृत विद्यार्थी; योजनेनुसार कौटुंबिक उत्पन्न साधारणतः ₹1–8 लाख/वर्षाहून कमी; प्रवर्ग व गुणवत्ता आधारित आरक्षण सामान्य.',
    },
  },
  {
    category: 'Employment & Skill Development',
    occupations: ['unemployed', 'student', 'daily-wage'],
    minAge: 18,
    maxAge: 35,
    note: {
      en: 'Unemployed or upskilling youth aged roughly 18–35; National Career Service / state employment portal registration often required.',
      hi: 'लगभग 18–35 आयु के बेरोजगार या कौशल-वृद्धि चाहने वाले युवा; राष्ट्रीय करियर सेवा/राज्य रोजगार पोर्टल पंजीकरण अक्सर आवश्यक।',
      mr: 'साधारण 18–35 वयोगटातील बेरोजगार किंवा कौशल्यवृद्धी इच्छिणारे तरुण; राष्ट्रीय करिअर सेवा/राज्य रोजगार पोर्टल नोंदणी अनेकदा आवश्यक.',
    },
  },
  {
    category: 'Agriculture & Farmers Welfare',
    occupations: ['farmer'],
    farmerLandBoost: true,
    note: {
      en: 'Farmers / agricultural workers with land, livestock or fishery holdings; most exclude income-tax payers; several prioritize small & marginal farmers.',
      hi: 'भूमि, पशुधन या मत्स्य पालन वाले किसान/कृषि श्रमिक; अधिकांश आयकरदाताओं को बाहर रखते हैं; कई छोटे व सीमांत किसानों को प्राथमिकता देते हैं।',
      mr: 'जमीन, पशुधन किंवा मत्स्यपालन असलेले शेतकरी/कृषी कामगार; बहुतांश आयकरदात्यांना वगळतात; अनेक लहान व अल्पभूधारक शेतकऱ्यांना प्राधान्य देतात.',
    },
  },
  {
    category: 'Health & Wellness',
    bplBoost: true,
    note: {
      en: 'Broadly available to citizens; many schemes prioritize BPL/low-income families; immunization and TB-control style schemes are near-universal.',
      hi: 'नागरिकों के लिए व्यापक रूप से उपलब्ध; कई योजनाएँ BPL/कम आय वाले परिवारों को प्राथमिकता देती हैं; टीकाकरण और टीबी-नियंत्रण जैसी योजनाएँ लगभग सार्वभौमिक हैं।',
      mr: 'नागरिकांसाठी व्यापकपणे उपलब्ध; अनेक योजना BPL/कमी उत्पन्न कुटुंबांना प्राधान्य देतात; लसीकरण व टीबी-नियंत्रण सारख्या योजना जवळजवळ सार्वत्रिक आहेत.',
    },
  },
  {
    category: 'Women & Child Development',
    gender: 'female',
    maxIncomeTypical: 300000,
    note: {
      en: 'Female applicants or parents/guardians of a girl child; many state schemes cap family income around ₹1–3 lakh/yr.',
      hi: 'महिला आवेदक या बालिका के माता-पिता/अभिभावक; कई राज्य योजनाएँ पारिवारिक आय ₹1–3 लाख/वर्ष तक सीमित करती हैं।',
      mr: 'महिला अर्जदार किंवा मुलीचे पालक; अनेक राज्य योजना कौटुंबिक उत्पन्न ₹1–3 लाख/वर्षापर्यंत मर्यादित ठेवतात.',
    },
  },
  {
    category: 'Senior Citizen & Pension',
    minAge: 58,
    bplBoost: true,
    note: {
      en: 'Age 60+ typically (58/65 for a few); state pension schemes usually require BPL/low-income status; savings schemes (SCSS, NPS, APY) are open to all adults.',
      hi: 'आमतौर पर 60+ आयु (कुछ के लिए 58/65); राज्य पेंशन योजनाओं के लिए आमतौर पर BPL/कम आय स्थिति आवश्यक; बचत योजनाएँ सभी वयस्कों के लिए खुली हैं।',
      mr: 'साधारणतः 60+ वय (काहींसाठी 58/65); राज्य पेन्शन योजनांसाठी सहसा BPL/कमी उत्पन्न स्थिती आवश्यक; बचत योजना सर्व प्रौढांसाठी खुल्या आहेत.',
    },
  },
  {
    category: 'Disability / Divyangjan Welfare',
    requiresDisability: true,
    maxIncomeTypical: 300000,
    note: {
      en: 'Person with a benchmark disability (40%+), certified via UDID; income ceiling applies for several schemes.',
      hi: 'बेंचमार्क दिव्यांगता (40%+) वाला व्यक्ति, UDID के माध्यम से प्रमाणित; कई योजनाओं के लिए आय सीमा लागू।',
      mr: 'बेंचमार्क दिव्यांगत्व (40%+) असलेली व्यक्ती, UDID द्वारे प्रमाणित; अनेक योजनांसाठी उत्पन्न मर्यादा लागू.',
    },
  },
  {
    category: 'Housing & Shelter',
    maxIncomeTypical: 1800000,
    bplBoost: true,
    note: {
      en: 'Households without a pucca house; EWS (≤₹3L), LIG (₹3–6L) or MIG (₹6–18L) income bands; priority to SC/ST/BPL/women-headed households.',
      hi: 'पक्के घर के बिना परिवार; EWS (≤₹3L), LIG (₹3–6L) या MIG (₹6–18L) आय वर्ग; SC/ST/BPL/महिला-प्रधान परिवारों को प्राथमिकता।',
      mr: 'पक्के घर नसलेली कुटुंबे; EWS (≤₹3L), LIG (₹3–6L) किंवा MIG (₹6–18L) उत्पन्न गट; SC/ST/BPL/महिला-प्रमुख कुटुंबांना प्राधान्य.',
    },
  },
  {
    category: 'Banking, Financial Services & Insurance',
    minAge: 18,
    maxAge: 70,
    note: {
      en: 'Broadly open to citizens with a bank/post office account; a few finance-corporation loans target specific communities.',
      hi: 'बैंक/डाकघर खाते वाले नागरिकों के लिए व्यापक रूप से खुला; कुछ वित्त-निगम ऋण विशिष्ट समुदायों को लक्षित करते हैं।',
      mr: 'बँक/पोस्ट खाते असलेल्या नागरिकांसाठी व्यापकपणे खुले; काही वित्त-महामंडळ कर्जे विशिष्ट समुदायांना लक्ष्य करतात.',
    },
  },
  {
    category: 'Business & Entrepreneurship / MSME',
    occupations: ['self-employed'],
    minAge: 18,
    reservedCategories: ['sc', 'st'],
    note: {
      en: 'Aged 18+ with a viable business/project proposal; Udyam registration needed for MSME-specific schemes; several reserved for SC/ST/Women/Minority entrepreneurs.',
      hi: '18+ आयु और व्यवहार्य व्यवसाय/परियोजना प्रस्ताव; MSME-विशिष्ट योजनाओं के लिए Udyam पंजीकरण आवश्यक; कई SC/ST/महिला/अल्पसंख्यक उद्यमियों के लिए आरक्षित।',
      mr: '18+ वय आणि व्यवहार्य व्यवसाय/प्रकल्प प्रस्ताव; MSME-विशिष्ट योजनांसाठी Udyam नोंदणी आवश्यक; अनेक SC/ST/महिला/अल्पसंख्याक उद्योजकांसाठी राखीव.',
    },
  },
  {
    category: 'Social Welfare (SC/ST/OBC/Minority) & Food Security',
    reservedCategories: ['sc', 'st', 'obc'],
    bplBoost: true,
    note: {
      en: 'SC/ST/OBC/Minority community (valid certificate) or BPL/AAY ration card holder; income ceiling applies for most non-food schemes.',
      hi: 'SC/ST/OBC/अल्पसंख्यक समुदाय (वैध प्रमाण पत्र) या BPL/AAY राशन कार्डधारक; अधिकांश गैर-खाद्य योजनाओं के लिए आय सीमा लागू।',
      mr: 'SC/ST/OBC/अल्पसंख्याक समुदाय (वैध प्रमाणपत्र) किंवा BPL/AAY रेशन कार्डधारक; बहुतांश गैर-अन्न योजनांसाठी उत्पन्न मर्यादा लागू.',
    },
  },
  {
    category: 'Rural Development, Environment & Water',
    occupations: ['daily-wage', 'unemployed', 'farmer'],
    note: {
      en: 'Mostly community/household infrastructure without individual means-testing; wage-employment schemes (e.g. MGNREGA) need a registered job card and rural residency.',
      hi: 'ज्यादातर सामुदायिक/घरेलू बुनियादी ढांचा बिना व्यक्तिगत आय जांच के; मजदूरी-रोजगार योजनाओं (जैसे मनरेगा) के लिए पंजीकृत जॉब कार्ड और ग्रामीण निवास आवश्यक।',
      mr: 'बहुतांश सामुदायिक/घरगुती पायाभूत सुविधा वैयक्तिक उत्पन्न तपासणीशिवाय; मजुरी-रोजगार योजनांसाठी (उदा. मनरेगा) नोंदणीकृत जॉब कार्ड व ग्रामीण वास्तव्य आवश्यक.',
    },
  },
  {
    category: 'Sports, Culture & Youth',
    minAge: 8,
    maxAge: 29,
    note: {
      en: 'Typically aged 8–29; selection is largely merit/talent-based with proof of participation or achievement.',
      hi: 'आमतौर पर 8–29 आयु; चयन काफी हद तक योग्यता/प्रतिभा आधारित है, भागीदारी या उपलब्धि के प्रमाण के साथ।',
      mr: 'साधारणतः 8–29 वय; निवड मुख्यतः गुणवत्ता/प्रतिभेवर आधारित, सहभाग किंवा कामगिरीच्या पुराव्यासह.',
    },
  },
  {
    category: 'Science, IT & Digital Communications',
    note: {
      en: 'Mostly infrastructure/community-access schemes; digital-literacy programs typically cover one member per rural household, aged 14–60.',
      hi: 'ज्यादातर बुनियादी ढांचा/सामुदायिक-पहुंच योजनाएँ; डिजिटल-साक्षरता कार्यक्रम आमतौर पर प्रति ग्रामीण परिवार एक सदस्य को कवर करते हैं, आयु 14–60।',
      mr: 'बहुतांश पायाभूत सुविधा/सामुदायिक-प्रवेश योजना; डिजिटल-साक्षरता कार्यक्रम सहसा प्रति ग्रामीण कुटुंब एक सदस्याला कव्हर करतात, वय 14–60.',
    },
  },
  {
    category: 'Transport & Infrastructure',
    note: {
      en: 'Mostly public infrastructure development with no individual beneficiary eligibility; a few vehicle-linked incentives (EV/scrappage) need ownership documents.',
      hi: 'ज्यादातर सार्वजनिक बुनियादी ढांचा विकास, कोई व्यक्तिगत लाभार्थी पात्रता नहीं; कुछ वाहन-संबंधित प्रोत्साहन (EV/स्क्रैपेज) के लिए स्वामित्व दस्तावेज़ आवश्यक।',
      mr: 'बहुतांश सार्वजनिक पायाभूत सुविधा विकास, वैयक्तिक लाभार्थी पात्रता नाही; काही वाहन-संबंधित प्रोत्साहन (EV/स्क्रॅपेज) साठी मालकी कागदपत्रे आवश्यक.',
    },
  },
  {
    category: 'Utility, Energy & Sanitation',
    bplBoost: true,
    note: {
      en: 'Households without an existing LPG connection/toilet/electricity connection; priority to BPL/SC-ST/women-headed households.',
      hi: 'मौजूदा एलपीजी कनेक्शन/शौचालय/बिजली कनेक्शन के बिना परिवार; BPL/SC-ST/महिला-प्रधान परिवारों को प्राथमिकता।',
      mr: 'विद्यमान एलपीजी जोडणी/शौचालय/वीज जोडणी नसलेली कुटुंबे; BPL/SC-ST/महिला-प्रमुख कुटुंबांना प्राधान्य.',
    },
  },
]

export const CATEGORY_RULE_MAP: Record<string, CategoryRule> = Object.fromEntries(
  CATEGORY_RULES.map((r) => [r.category, r]),
)
