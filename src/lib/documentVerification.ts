import type { DocumentField, UserProfile } from '../types'

/**
 * Simulates a Vision-Language Model reading an uploaded document and
 * extracting structured fields, then cross-checking them against what the
 * user typed into the form. In production this call is replaced by a VLM
 * inference request (e.g. Qwen2-VL / InternVL) against the uploaded image.
 */

function fmtDOB(age: number): string {
  const year = new Date().getFullYear() - age
  return `01/01/${year}`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function simulateExtraction(docType: string, profile: UserProfile, fileName: string): DocumentField[] {
  // Deterministic-ish "randomness" seeded by filename length so repeated
  // uploads of the same doc type behave consistently within a session.
  const seed = fileName.length % 5
  const introduceMismatch = seed === 0 && Math.random() < 0.35

  const fields: DocumentField[] = []

  switch (docType) {
    case 'aadhaar':
      fields.push(
        { key: 'name', label: 'Name', formValue: profile.name, extractedValue: profile.name, match: true },
        { key: 'dob', label: 'Date of Birth', formValue: fmtDOB(profile.age), extractedValue: fmtDOB(profile.age), match: true },
        { key: 'gender', label: 'Gender', formValue: capitalize(profile.gender), extractedValue: capitalize(profile.gender), match: true },
      )
      break
    case 'income':
      fields.push(
        { key: 'name', label: 'Name', formValue: profile.name, extractedValue: profile.name, match: true },
        {
          key: 'income',
          label: 'Annual Income',
          formValue: `₹${profile.annualIncome.toLocaleString('en-IN')}`,
          extractedValue: introduceMismatch
            ? `₹${Math.round(profile.annualIncome * 1.12).toLocaleString('en-IN')}`
            : `₹${profile.annualIncome.toLocaleString('en-IN')}`,
          match: !introduceMismatch,
        },
      )
      break
    case 'caste':
      fields.push(
        { key: 'name', label: 'Name', formValue: profile.name, extractedValue: profile.name, match: true },
        { key: 'category', label: 'Category', formValue: profile.category.toUpperCase(), extractedValue: profile.category.toUpperCase(), match: true },
      )
      break
    case 'landRecord':
      fields.push(
        { key: 'name', label: 'Owner Name', formValue: profile.name, extractedValue: profile.name, match: true },
        {
          key: 'land',
          label: 'Land Area',
          formValue: `${profile.landHoldingAcres} acres`,
          extractedValue: introduceMismatch ? `${(profile.landHoldingAcres + 0.8).toFixed(1)} acres` : `${profile.landHoldingAcres} acres`,
          match: !introduceMismatch,
        },
      )
      break
    case 'bankPassbook':
      fields.push(
        { key: 'name', label: 'Account Holder', formValue: profile.name, extractedValue: profile.name, match: true },
        { key: 'acct', label: 'Account No.', formValue: 'XXXX XXXX 4821', extractedValue: 'XXXX XXXX 4821', match: true },
      )
      break
    case 'marksheet':
      fields.push(
        { key: 'name', label: 'Student Name', formValue: profile.name, extractedValue: profile.name, match: true },
        { key: 'class', label: 'Class', formValue: 'XII', extractedValue: 'XII', match: true },
      )
      break
    case 'disabilityCert':
      fields.push(
        { key: 'name', label: 'Name', formValue: profile.name, extractedValue: profile.name, match: true },
        { key: 'disability', label: 'Disability %', formValue: '≥40%', extractedValue: '45%', match: true },
      )
      break
    case 'bplCard':
      fields.push(
        { key: 'name', label: 'Head of Household', formValue: profile.name, extractedValue: profile.name, match: true },
        { key: 'category', label: 'Card Type', formValue: 'BPL', extractedValue: 'BPL', match: true },
      )
      break
    case 'domicile':
      fields.push(
        { key: 'name', label: 'Name', formValue: profile.name, extractedValue: profile.name, match: true },
        { key: 'state', label: 'State', formValue: profile.state, extractedValue: profile.state, match: true },
      )
      break
    default:
      fields.push({ key: 'name', label: 'Name', formValue: profile.name, extractedValue: profile.name, match: true })
  }

  return fields
}
