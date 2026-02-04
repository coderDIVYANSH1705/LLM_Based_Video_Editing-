'use client'

import { useState } from 'react'
import UploadSection from '@/components/UploadSection'
import ResultsDashboard from '@/components/ResultsDashboard'
import FunLoadingAnimation from '@/components/FunLoadingAnimation'

export default function Home() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 -z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-40 right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"></div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsIDIzNiwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 -z-10"></div>

      {loading && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/40 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20">
            <FunLoadingAnimation size="lg" />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-8 py-12 relative">
        {/* Header with Gradient Text and Animated Elements */}
        <header className="text-center mb-16 relative">
          {/* Floating Elements */}
          <div className="absolute -top-10 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl opacity-20 animate-float"></div>
          <div className="absolute -top-5 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float animation-delay-2000"></div>
          
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-2xl opacity-30 animate-pulse"></div>
              <h1 className="text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent relative animate-gradient pb-2">
                🎬 AI Reel Optimizer
              </h1>
            </div>
          </div>
          
          <p className="text-xl text-gray-700 font-medium mb-4">
            Grammarly for Short-Form Videos
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-semibold text-purple-700 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              ⚡ AI-Powered Analysis
            </span>
            <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-semibold text-pink-700 border border-pink-200 shadow-sm hover:shadow-md transition-shadow">
              🎯 Instant Feedback
            </span>
            <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-700 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              📈 Boost Engagement
            </span>
          </div>
        </header>

        {/* Main Content Card */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          {/* Glass Card */}
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Top Gradient Bar */}
            <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient"></div>
            
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

        {/* Footer Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-gray-700">Powered by AI • Built for Creators</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </main>
  )
}