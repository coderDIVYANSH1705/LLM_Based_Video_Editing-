'use client'

import { Hash, Type, Copy, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface HashtagTitleSuggestionsProps {
  hashtags: string[]
  titles: string[]
}

export default function HashtagTitleSuggestions({ hashtags, titles }: HashtagTitleSuggestionsProps) {
  const [copiedHashtags, setCopiedHashtags] = useState(false)
  const [copiedTitle, setCopiedTitle] = useState<number | null>(null)

  const copyHashtags = () => {
    const hashtagText = hashtags.join(' ')
    navigator.clipboard.writeText(hashtagText)
    setCopiedHashtags(true)
    setTimeout(() => setCopiedHashtags(false), 2000)
  }

  const copyTitle = (title: string, index: number) => {
    navigator.clipboard.writeText(title)
    setCopiedTitle(index)
    setTimeout(() => setCopiedTitle(null), 2000)
  }

  if (!hashtags || !titles || (hashtags.length === 0 && titles.length === 0)) {
    return null
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Hashtag Suggestions */}
      {hashtags && hashtags.length > 0 && (
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          
          <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-blue-200 p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Hash className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900">Hashtag Suggestions</h3>
                  <p className="text-sm text-blue-600">
                    AI-generated tags for maximum reach
                  </p>
                </div>
              </div>
              <button
                onClick={copyHashtags}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 hover:border-blue-400 transition-all"
              >
                {copiedHashtags ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Copy All</span>
                  </>
                )}
              </button>
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {hashtags.map((hashtag, index) => (
                <div
                  key={index}
                  className="group/tag px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 rounded-lg border border-blue-300 hover:border-blue-400 transition-all cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(hashtag)
                  }}
                >
                  <span className="text-sm font-medium text-blue-700 group-hover/tag:text-blue-900 transition-colors">
                    {hashtag}
                  </span>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600">
                  Click any hashtag to copy individually, or use "Copy All" to copy all hashtags at once
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Title Suggestions */}
      {titles && titles.length > 0 && (
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          
          <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-blue-200 p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Type className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">Title Suggestions</h3>
                <p className="text-sm text-blue-600">
                  Engaging titles to hook viewers
                </p>
              </div>
            </div>

            {/* Titles */}
            <div className="space-y-3">
              {titles.map((title, index) => (
                <div
                  key={index}
                  className="group/title p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          Option {index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-blue-900 leading-relaxed">
                        {title}
                      </p>
                    </div>
                    <button
                      onClick={() => copyTitle(title, index)}
                      className="flex-shrink-0 p-2 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-all"
                    >
                      {copiedTitle === index ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-blue-600 group-hover/title:text-blue-700 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600">
                  Choose a title that creates curiosity and includes relevant keywords for better discoverability
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
