'use client'

import { Music, Volume2, Zap, Search, Sparkles } from 'lucide-react'

interface MusicRecommendation {
  genre: string
  mood: string
  bpm_range: string
  vocals_preference: string
  energy_level: string
  reasoning: string
  search_keywords: string[]
  best_for?: string
}

interface MusicRecommendationCardProps {
  recommendation: MusicRecommendation
}

export default function MusicRecommendationCard({ recommendation }: MusicRecommendationCardProps) {
  const getEnergyColor = (energy: string) => {
    const lower = energy.toLowerCase()
    if (lower === 'high') return 'text-red-400 bg-red-500/20 border-red-500/30'
    if (lower === 'medium') return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30'
  }

  const handleSearch = (keyword: string) => {
    const searchQuery = encodeURIComponent(keyword)
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank')
  }

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
      
      <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
            <Music className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Background Music Recommendation</h3>
            <p className="text-sm text-slate-400">
              AI-powered music suggestion to enhance your video
            </p>
          </div>
          {recommendation.best_for && (
            <div className="px-3 py-1.5 bg-indigo-500/20 rounded-full border border-indigo-500/30">
              <span className="text-xs font-semibold text-indigo-300">
                Best for: {recommendation.best_for}
              </span>
            </div>
          )}
        </div>

        {/* Main Info Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Genre */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Music className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Genre</span>
            </div>
            <p className="text-lg font-bold text-white">{recommendation.genre}</p>
          </div>

          {/* Mood */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mood</span>
            </div>
            <p className="text-lg font-bold text-white">{recommendation.mood}</p>
          </div>

          {/* BPM Range */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">BPM Range</span>
            </div>
            <p className="text-lg font-bold text-white">{recommendation.bpm_range}</p>
          </div>

          {/* Energy Level */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Energy Level</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getEnergyColor(recommendation.energy_level)}`}>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
              <span className="text-sm font-bold">{recommendation.energy_level}</span>
            </div>
          </div>
        </div>

        {/* Vocals Preference */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vocals</span>
          </div>
          <p className="text-sm font-medium text-white">{recommendation.vocals_preference}</p>
        </div>

        {/* Reasoning */}
        <div className="mb-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-indigo-300 mb-1">Why This Music?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Search Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Search Keywords
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendation.search_keywords.map((keyword, index) => (
              <button
                key={index}
                onClick={() => handleSearch(keyword)}
                className="group/btn px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-indigo-500/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300 group-hover/btn:text-white transition-colors">
                    {keyword}
                  </span>
                  <Search className="h-3 w-3 text-slate-400 group-hover/btn:text-indigo-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Click any keyword to search for royalty-free music on YouTube
          </p>
        </div>
      </div>
    </div>
  )
}
