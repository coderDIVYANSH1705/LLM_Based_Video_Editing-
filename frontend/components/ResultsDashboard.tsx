'use client'

import { ArrowLeft, Video, Volume2, FileText, AlertCircle, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'
import ThumbnailGallery from './ThumbnailGallery'
import MusicRecommendationCard from './MusicRecommendationCard'
import HashtagTitleSuggestions from './HashtagTitleSuggestions'

export default function ResultsDashboard({ results, onReset }: any) {
  // Debug logging
  console.log('🔍 ResultsDashboard received:', {
    has_music: !!results.music_recommendation,
    has_hashtags: !!results.hashtag_suggestions,
    has_titles: !!results.title_suggestions,
    has_thumbnails: !!results.thumbnail_suggestions,
    music_data: results.music_recommendation,
    hashtags_data: results.hashtag_suggestions,
    titles_data: results.title_suggestions
  })

  const getScoreColor = (score: number) => {
    if (score >= 8) return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', glow: 'from-emerald-600 to-emerald-400' }
    if (score >= 6) return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50', glow: 'from-amber-600 to-amber-400' }
    return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', glow: 'from-red-600 to-red-400' }
  }

  const overallColors = getScoreColor(results.overall_score)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Analyze Another</span>
        </button>
        <div className="px-4 py-2 bg-white backdrop-blur-sm rounded-full border border-blue-200">
          <span className="text-sm text-blue-600">
            Platform: <span className="text-blue-900 font-medium">{results.platform}</span>
          </span>
        </div>
      </div>

      {/* Overall Score - Hero Section */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${overallColors.glow} rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
        
        <div className={`relative bg-white backdrop-blur-xl rounded-2xl border ${overallColors.border} p-12 shadow-lg`}>
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
              Overall Performance
            </p>
            <div className="relative inline-block">
              <div className={`absolute inset-0 bg-gradient-to-r ${overallColors.glow} rounded-2xl blur-3xl opacity-50`}></div>
              <div className={`relative text-8xl font-black ${overallColors.text} mb-2`}>
                {results.overall_score.toFixed(1)}
              </div>
            </div>
            <p className="text-blue-400 text-lg">out of 10</p>
            
            {/* Score Interpretation */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              {results.overall_score >= 8 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Excellent Performance</span>
                </>
              ) : results.overall_score >= 6 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">Good, Room for Improvement</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Needs Optimization</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Priorities */}
      {results.top_3_priorities && results.top_3_priorities.length > 0 && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-blue-200 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-900">Top 3 Priorities</h3>
            </div>
            <div className="space-y-3">
              {results.top_3_priorities.map((priority: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-blue-900 text-sm leading-relaxed">{priority}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Music Recommendation */}
      {results.music_recommendation ? (
        <MusicRecommendationCard recommendation={results.music_recommendation} />
      ) : (
        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-sm text-yellow-400">⚠️ Music recommendation not available</p>
        </div>
      )}

      {/* Hashtag and Title Suggestions */}
      {(results.hashtag_suggestions || results.title_suggestions) ? (
        <HashtagTitleSuggestions 
          hashtags={results.hashtag_suggestions || []} 
          titles={results.title_suggestions || []} 
        />
      ) : (
        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-sm text-yellow-400">⚠️ Hashtag and title suggestions not available</p>
        </div>
      )}

      {/* Thumbnail Suggestions */}
      {results.thumbnail_suggestions && results.thumbnail_suggestions.length > 0 && (
        <ThumbnailGallery thumbnails={results.thumbnail_suggestions} />
      )}

      {/* Detailed Scores Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <ScoreCard
          title="Video Quality"
          icon={<Video className="h-6 w-6" />}
          score={results.video?.score || 0}
          issues={results.video?.issues || []}
          suggestions={results.video?.suggestions || []}
          color="blue"
        />

        <ScoreCard
          title="Audio Quality"
          icon={<Volume2 className="h-6 w-6" />}
          score={results.audio?.score || 0}
          issues={results.audio?.issues || []}
          suggestions={results.audio?.suggestions || []}
          color="cyan"
        />

        <ScoreCard
          title="Content"
          icon={<FileText className="h-6 w-6" />}
          score={results.content?.score || 0}
          issues={results.content?.issues || []}
          suggestions={results.content?.suggestions || []}
          color="blue-light"
          extra={
            results.content?.hook_score !== undefined && (
              <div className="mt-4 pt-4 border-t border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Hook Score</span>
                  <span className="text-sm font-bold text-blue-900">{results.content.hook_score}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Call-to-Action</span>
                  <span className="flex items-center gap-1">
                    {results.content.has_cta ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">Present</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span className="text-sm font-medium text-red-400">Missing</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            )
          }
        />
      </div>
    </div>
  )
}

function ScoreCard({ title, icon, score, issues, suggestions, color, extra }: any) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return { text: 'text-emerald-400', glow: 'from-emerald-600 to-emerald-400' }
    if (score >= 6) return { text: 'text-amber-400', glow: 'from-amber-600 to-amber-400' }
    return { text: 'text-red-400', glow: 'from-red-600 to-red-400' }
  }

  const scoreColors = getScoreColor(score)
  const colorMap: any = {
    blue: 'from-blue-600 to-blue-400',
    cyan: 'from-cyan-600 to-cyan-400',
    'blue-light': 'from-blue-500 to-cyan-500'
  }

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${colorMap[color]} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
      
      <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-blue-200 p-6 h-full flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-r ${colorMap[color]} rounded-lg`}>
              {icon}
            </div>
            <h3 className="font-bold text-blue-900">{title}</h3>
          </div>
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${scoreColors.glow} rounded-lg blur-lg opacity-50`}></div>
            <div className={`relative text-3xl font-black ${scoreColors.text}`}>
              {score.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Issues */}
        {issues.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Issues Found
            </h4>
            <div className="space-y-2">
              {issues.map((issue: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
                  <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Recommendations
            </h4>
            <div className="space-y-2">
              {suggestions.map((suggestion: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-blue-900 bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extra Content */}
        {extra}
      </div>
    </div>
  )
}
