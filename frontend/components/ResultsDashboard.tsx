'use client'

import { ArrowLeft, Video, Volume2, FileText, AlertCircle } from 'lucide-react'

export default function ResultsDashboard({ results, onReset }: any) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50'
    if (score >= 6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Analyze Another Video
        </button>
        <div className="text-sm text-gray-500">
          Platform: <span className="font-medium">{results.platform}</span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Overall Score</h2>
        <div className={`text-6xl font-bold ${getScoreColor(results.overall_score)} inline-block px-8 py-4 rounded-lg`}>
          {results.overall_score.toFixed(1)}
        </div>
        <p className="text-gray-600 mt-2">out of 10</p>
      </div>

      {/* Top Priorities */}
      {results.top_3_priorities && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Top 3 Priorities
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            {results.top_3_priorities.map((priority: string, i: number) => (
              <li key={i}>{priority}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Detailed Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Video */}
        <ScoreCard
          title="Video Quality"
          icon={<Video className="h-6 w-6" />}
          score={results.video?.score || 0}
          issues={results.video?.issues || []}
          suggestions={results.video?.suggestions || []}
        />

        {/* Audio */}
        <ScoreCard
          title="Audio Quality"
          icon={<Volume2 className="h-6 w-6" />}
          score={results.audio?.score || 0}
          issues={results.audio?.issues || []}
          suggestions={results.audio?.suggestions || []}
        />

        {/* Content */}
        <ScoreCard
          title="Content"
          icon={<FileText className="h-6 w-6" />}
          score={results.content?.score || 0}
          issues={results.content?.issues || []}
          suggestions={results.content?.suggestions || []}
          extra={
            results.content?.hook_score !== undefined && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-600">
                  Hook Score: <span className="font-semibold">{results.content.hook_score}/10</span>
                </p>
                <p className="text-sm text-gray-600">
                  CTA: <span className="font-semibold">{results.content.has_cta ? '✓ Present' : '✗ Missing'}</span>
                </p>
              </div>
            )
          }
        />
      </div>
    </div>
  )
}

function ScoreCard({ title, icon, score, issues, suggestions, extra }: any) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </div>
      </div>

      {issues.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Issues:</h4>
          <ul className="text-sm text-red-600 space-y-1">
            {issues.map((issue: string, i: number) => (
              <li key={i}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {suggestions.map((suggestion: string, i: number) => (
              <li key={i}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {extra}
    </div>
  )
}
