import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, FileWarning, Loader2, ScanSearch, Upload } from 'lucide-react'
import { useLang } from '../context/useLang'
import { StepIndicator } from './StepIndicator'
import { LanguageSwitcher } from './LanguageSwitcher'
import { DOC_TYPE_LABELS } from '../i18n/strings'
import { simulateExtraction } from '../lib/documentVerification'
import type { UploadedDocument, UserProfile } from '../types'

function relevantDocTypes(profile: UserProfile): string[] {
  const docs = ['aadhaar', 'bankPassbook']
  if (profile.occupation === 'farmer' || profile.landHoldingAcres > 0) docs.push('landRecord')
  if (profile.category !== 'general') docs.push('caste')
  if (profile.occupation === 'student') docs.push('marksheet')
  if (profile.hasDisability) docs.push('disabilityCert')
  if (profile.isBPL) docs.push('bplCard')
  docs.push('income')
  docs.push('domicile')
  return docs
}

export function DocumentUpload({
  profile,
  documents,
  onBack,
  onChangeDocuments,
  onContinue,
}: {
  profile: UserProfile
  documents: Record<string, UploadedDocument>
  onBack: () => void
  onChangeDocuments: (docs: Record<string, UploadedDocument>) => void
  onContinue: () => void
}) {
  const { t, lang } = useLang()
  const docTypes = relevantDocTypes(profile)
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})
  const [openType, setOpenType] = useState<string | null>(null)

  const handleFile = (docType: string, file: File) => {
    const doc: UploadedDocument = {
      id: `${docType}-${Date.now()}`,
      docType,
      fileName: file.name,
      status: 'processing',
      extractedFields: [],
      confidence: 0,
    }
    onChangeDocuments({ ...documents, [docType]: doc })

    setTimeout(() => {
      const fields = simulateExtraction(docType, profile, file.name)
      const allMatch = fields.every((f) => f.match)
      const confidence = 92 + Math.round(Math.random() * 7)
      onChangeDocuments({
        ...documents,
        [docType]: { ...doc, status: allMatch ? 'verified' : 'mismatch', extractedFields: fields, confidence },
      })
    }, 900 + Math.random() * 500)
  }

  const verifiedCount = Object.values(documents).filter((d) => d.status === 'verified' || d.status === 'mismatch').length

  return (
    <div className="min-h-full">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <button onClick={onBack} className="flex cursor-pointer items-center gap-1.5 text-sm text-text-muted hover:text-text">
          <ArrowLeft size={15} /> {t('back')}
        </button>
        <LanguageSwitcher />
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8"><StepIndicator step={2} /></div>

        <div className="animate-fade-up rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <ScanSearch size={19} />
            </div>
            <h2 className="text-lg font-semibold">{t('step2Title')}</h2>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-text-muted">{t('uploadPrompt')}</p>

          <div className="space-y-3">
            {docTypes.map((docType) => {
              const doc = documents[docType]
              return (
                <div key={docType} className="rounded-xl border border-border">
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{DOC_TYPE_LABELS[docType]?.[lang] ?? docType}</div>
                      {doc && <div className="mt-0.5 truncate text-xs text-text-faint">{doc.fileName}</div>}
                    </div>

                    {!doc && (
                      <button
                        onClick={() => fileInputs.current[docType]?.click()}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text hover:bg-border/50"
                      >
                        <Upload size={13} /> {t('dragDrop')}
                      </button>
                    )}

                    {doc?.status === 'processing' && (
                      <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-muted">
                        <Loader2 size={14} className="animate-spin text-brand" /> {t('processing')}
                      </div>
                    )}

                    {doc?.status === 'verified' && (
                      <button
                        onClick={() => setOpenType(openType === docType ? null : docType)}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-success-soft px-3 py-1.5 text-xs font-medium text-success"
                      >
                        <CheckCircle2 size={13} /> {t('verified')}
                      </button>
                    )}

                    {doc?.status === 'mismatch' && (
                      <button
                        onClick={() => setOpenType(openType === docType ? null : docType)}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-warning-soft px-3 py-1.5 text-xs font-medium text-warning"
                      >
                        <FileWarning size={13} /> {t('mismatch')}
                      </button>
                    )}

                    <input
                      ref={(el) => { fileInputs.current[docType] = el }}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFile(docType, file)
                        e.target.value = ''
                      }}
                    />
                  </div>

                  {doc && (doc.status === 'verified' || doc.status === 'mismatch') && openType === docType && (
                    <div className="animate-fade-up border-t border-border bg-surface-2/60 px-4 py-3">
                      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-text-faint">
                        <ScanSearch size={12} /> {lang === 'en' ? 'VLM extracted fields' : lang === 'hi' ? 'VLM द्वारा निकाले गए फ़ील्ड' : 'VLM ने काढलेले फील्ड'} · {doc.confidence}% {lang === 'en' ? 'confidence' : lang === 'hi' ? 'विश्वास' : 'विश्वास'}
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {doc.extractedFields.map((f) => (
                          <div key={f.key} className={`rounded-lg border px-2.5 py-1.5 text-xs ${f.match ? 'border-border bg-surface' : 'border-warning/40 bg-warning-soft'}`}>
                            <div className="text-text-faint">{f.label}</div>
                            <div className="flex items-center justify-between font-medium">
                              <span>{f.extractedValue}</span>
                              {!f.match && <span className="text-[10px] text-warning">≠ {f.formValue}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={onContinue} className="cursor-pointer text-sm text-text-muted underline-offset-2 hover:text-text hover:underline">
              {t('skipDocs')}
            </button>
            <button
              onClick={onContinue}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-brand-strong"
            >
              {t('viewResults')} {verifiedCount > 0 && `(${verifiedCount}/${docTypes.length})`}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
