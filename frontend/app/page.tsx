'use client'

import { useState } from 'react'
import UploadSection from '@/components/UploadSection'
import ResultsDashboard from '@/components/ResultsDashboard'

export default function Home() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
        
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-violet-600/10 via-transparent to-transparent"></div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-12">
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-violet-600/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-violet-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-white mb-2">Analyzing Your Video</p>
                  <p className="text-sm text-slate-400">AI is working its magic...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-300">AI-Powered Video Analysis</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="text-gradient from-white via-slate-200 to-slate-400">
              Reel
            </span>
            <span className="text-gradient from-violet-400 via-fuchsia-400 to-cyan-400">
              {' '}Optimizer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-8">
            Transform your short-form videos with AI-powered insights
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Instant Analysis', 'Platform-Specific', 'Actionable Tips'].map((feature, i) => (
              <span 
                key={i}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/10 transition-colors"
              >
                {feature}
              </span>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-3xl blur-2xl opacity-20"></div>
          
          {/* Content Card */}
          <div className="relative bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Top Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600"></div>
            
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
          <p className="text-sm text-slate-500">
            Built for creators • Powered by AI • Made with ❤️
          </p>
        </footer>
      </div>
    </main>
  )
}