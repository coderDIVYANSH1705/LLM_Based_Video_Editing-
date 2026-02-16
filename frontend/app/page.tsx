'use client'

import { useState } from 'react'
import UploadSection from '@/components/UploadSection'
import ResultsDashboard from '@/components/ResultsDashboard'

export default function Home() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.05)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
        
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/10 via-transparent to-transparent"></div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-blue-200 p-12 shadow-2xl">
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-blue-900 mb-2">Analyzing Your Video</p>
                  <p className="text-sm text-blue-600">AI is working its magic...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-sm font-medium text-blue-900">AI-Powered Video Analysis</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900">
              Reel
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600">
              {' '}Optimizer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-700 font-light max-w-2xl mx-auto mb-8">
            Transform your short-form videos with AI-powered insights
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Instant Analysis', 'Platform-Specific', 'Actionable Tips'].map((feature, i) => (
              <span 
                key={i}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-2xl opacity-20"></div>
          
          {/* Content Card */}
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl border border-blue-200 overflow-hidden shadow-2xl shadow-blue-500/10">
            {/* Top Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"></div>
            
            <div className="p-8 md:p-12">
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
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-blue-600">
            Built for creators • Powered by AI • Made with ❤️
          </p>
        </footer>
      </div>
    </main>
  )
}