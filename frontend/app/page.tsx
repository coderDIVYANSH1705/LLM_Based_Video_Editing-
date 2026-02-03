'use client'

import { useState } from 'react'
import UploadSection from '@/components/UploadSection'
import ResultsDashboard from '@/components/ResultsDashboard'

export default function Home() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎬 AI Reel Optimizer
          </h1>
          <p className="text-gray-600">
            Grammarly for Short-Form Videos
          </p>
        </header>

        {!results ? (
          <UploadSection 
            onResults={setResults} 
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <ResultsDashboard 
            results={results} 
            onReset={() => setResults(null)}
          />
        )}
      </div>
    </main>
  )
}
