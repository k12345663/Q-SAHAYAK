import { useState } from 'react'
import { LangProvider } from './context/LangContext'
import { Landing } from './components/Landing'
import { EligibilityForm } from './components/EligibilityForm'
import { DocumentUpload } from './components/DocumentUpload'
import { Results } from './components/Results'
import type { UploadedDocument, UserProfile } from './types'

type Screen = 'landing' | 'form' | 'upload' | 'results'

function AppShell() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [documents, setDocuments] = useState<Record<string, UploadedDocument>>({})

  return (
    <div className="min-h-screen bg-bg text-text">
      {screen === 'landing' && <Landing onStart={() => setScreen('form')} />}

      {screen === 'form' && (
        <EligibilityForm
          initial={profile}
          onBack={() => setScreen('landing')}
          onSubmit={(p) => {
            setProfile(p)
            setScreen('upload')
          }}
        />
      )}

      {screen === 'upload' && profile && (
        <DocumentUpload
          profile={profile}
          documents={documents}
          onChangeDocuments={setDocuments}
          onBack={() => setScreen('form')}
          onContinue={() => setScreen('results')}
        />
      )}

      {screen === 'results' && profile && (
        <Results
          profile={profile}
          onBack={() => setScreen('upload')}
          onStartOver={() => {
            setProfile(null)
            setDocuments({})
            setScreen('landing')
          }}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppShell />
    </LangProvider>
  )
}
