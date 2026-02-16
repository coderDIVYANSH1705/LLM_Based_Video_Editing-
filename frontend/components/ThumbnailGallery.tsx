'use client'

import { Image, Download, Clock, Star, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface ThumbnailSuggestion {
  timestamp: number
  score: number
  preview_image: string
  reasoning: string
  is_recommended: boolean
  quality_metrics: {
    sharpness: number
    brightness: number
    contrast: number
    face_detected: boolean
    face_count?: number
    composition_score: number
    color_vibrancy: number
  }
}

interface ThumbnailGalleryProps {
  thumbnails: ThumbnailSuggestion[]
}

export default function ThumbnailGallery({ thumbnails }: ThumbnailGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!thumbnails || thumbnails.length === 0) {
    return null
  }

  const selectedThumbnail = thumbnails[selectedIndex]

  const handleDownload = (thumbnail: ThumbnailSuggestion, index: number) => {
    // Create download link
    const link = document.createElement('a')
    link.href = thumbnail.preview_image
    link.download = `thumbnail-${index + 1}-${thumbnail.timestamp.toFixed(1)}s.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
      
      <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-blue-200 p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Image className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900">AI Thumbnail Suggestions</h3>
            <p className="text-sm text-blue-600">
              {thumbnails.length} eye-catching frames selected from your video
            </p>
          </div>
        </div>

        {/* Main Preview */}
        <div className="mb-6">
          <div className="relative group/preview">
            {/* Recommended Badge */}
            {selectedThumbnail.is_recommended && (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
                <Star className="h-4 w-4 text-white fill-white" />
                <span className="text-xs font-bold text-white">RECOMMENDED</span>
              </div>
            )}

            {/* Score Badge */}
            <div className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
              <span className={`text-sm font-bold ${getScoreColor(selectedThumbnail.score)}`}>
                {selectedThumbnail.score}/100
              </span>
            </div>

            {/* Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white/10">
              <img
                src={selectedThumbnail.preview_image}
                alt={`Thumbnail at ${formatTime(selectedThumbnail.timestamp)}`}
                className="w-full h-full object-cover"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatTime(selectedThumbnail.timestamp)}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedThumbnail, selectedIndex)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 transition-colors"
                    >
                      <Download className="h-4 w-4 text-white" />
                      <span className="text-sm font-medium text-white">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 leading-relaxed">
                  {selectedThumbnail.reasoning}
                </p>
                
                {/* Quality Metrics */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MetricBadge
                    label="Sharpness"
                    value={selectedThumbnail.quality_metrics.sharpness}
                  />
                  <MetricBadge
                    label="Brightness"
                    value={selectedThumbnail.quality_metrics.brightness}
                  />
                  <MetricBadge
                    label="Composition"
                    value={selectedThumbnail.quality_metrics.composition_score}
                  />
                  <MetricBadge
                    label="Vibrancy"
                    value={selectedThumbnail.quality_metrics.color_vibrancy}
                  />
                </div>

                {/* Face Detection */}
                {selectedThumbnail.quality_metrics.face_detected && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs font-medium text-emerald-400">
                      {selectedThumbnail.quality_metrics.face_count || 1} face{(selectedThumbnail.quality_metrics.face_count || 1) > 1 ? 's' : ''} detected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-5 gap-3">
          {thumbnails.map((thumbnail, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105'
                  : 'border-blue-200 hover:border-blue-400 hover:scale-105'
              }`}
            >
              {/* Recommended Star */}
              {thumbnail.is_recommended && (
                <div className="absolute top-1 right-1 z-10">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400 drop-shadow-lg" />
                </div>
              )}

              {/* Image */}
              <img
                src={thumbnail.preview_image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-white">
                    {formatTime(thumbnail.timestamp)}
                  </span>
                  <span className={`text-[10px] font-bold ${getScoreColor(thumbnail.score)}`}>
                    {thumbnail.score}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Download All Button */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => {
              thumbnails.forEach((thumbnail, index) => {
                setTimeout(() => handleDownload(thumbnail, index), index * 100)
              })
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="h-5 w-5" />
            <span>Download All Thumbnails</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricBadge({ label, value }: { label: string; value: number }) {
  const getColor = (val: number) => {
    if (val >= 70) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
    if (val >= 50) return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    return 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  return (
    <div className={`px-2 py-1 rounded border ${getColor(value)}`}>
      <div className="text-[10px] font-medium opacity-70">{label}</div>
      <div className="text-xs font-bold">{Math.round(value)}</div>
    </div>
  )
}
