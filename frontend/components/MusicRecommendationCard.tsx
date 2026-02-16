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
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
      
      <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-blue-200 p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Music className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900">Background Music Recommendation</h3>
            <p className="text-sm text-blue-600">
              AI-powered music suggestion to enhance your video
            </p>
          </div>
          {recommendation.best_for && (
            <div className="px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
              <span className="text-xs font-semibold text-blue-700">
                Best for: {recommendation.best_for}
              </span>
            </div>
          )}
        </div>

        {/* Main Info Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Genre */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Music className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Genre</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{recommendation.genre}</p>
          </div>

          {/* Mood */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Mood</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{recommendation.mood}</p>
          </div>

          {/* BPM Range */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">BPM Range</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{recommendation.bpm_range}</p>
          </div>

          {/* Energy Level */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Energy Level</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getEnergyColor(recommendation.energy_level)}`}>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
              <span className="text-sm font-bold">{recommendation.energy_level}</span>
            </div>
          </div>
        </div>

        {/* Vocals Preference */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Vocals</span>
          </div>
          <p className="text-sm font-medium text-blue-900">{recommendation.vocals_preference}</p>
        </div>

        {/* Reasoning */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-700 mb-1">Why This Music?</h4>
              <p className="text-sm text-blue-900 leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Search Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Quick Search Keywords
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendation.search_keywords.map((keyword, index) => (
              <button
                key={index}
                onClick={() => handleSearch(keyword)}
                className="group/btn px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 hover:border-blue-400 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700 group-hover/btn:text-blue-900 transition-colors">
                    {keyword}
                  </span>
                  <Search className="h-3 w-3 text-blue-600 group-hover/btn:text-blue-700 transition-colors" />
                </div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-blue-600">
            Click any keyword to search for royalty-free music on YouTube
          </p>
        </div>
      </div>
    </div>
  )
}
