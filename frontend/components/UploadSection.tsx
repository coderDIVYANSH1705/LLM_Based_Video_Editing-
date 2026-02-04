'use client'

import { useState } from 'react'
import axios from 'axios'
import { Upload, Loader2, Video, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function UploadSection({ onResults, loading, setLoading }: any) {
  const [file, setFile] = useState<File | null>(null)
  const [platform, setPlatform] = useState('instagram')
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile)
        setUploadSuccess(true)
        setTimeout(() => setUploadSuccess(false), 2000)
      } else {
        setError('Please upload a valid video file')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('video', file)
    formData.append('platform', platform)

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000
      })
      onResults(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const platformIcons = {
    instagram: '📸',
    youtube_shorts: '▶️',
    other: '🎥'
  }

  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <div className="relative group">
        {/* Animated Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 animate-gradient-slow"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Upload Your Video
              </h2>
              <p className="text-sm text-gray-600">Maximum 60 seconds, up to 100MB</p>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
                : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
            }`}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
            />
            
            <label htmlFor="video-upload" className="cursor-pointer block">
              {/* Upload Icon with Animation */}
              <div className="relative mb-4">
                {file ? (
                  <div className="inline-flex items-center justify-center">
                    <CheckCircle2 className={`h-16 w-16 text-green-500 ${uploadSuccess ? 'animate-bounce' : ''}`} />
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center">
                    <Upload className={`h-16 w-16 text-purple-400 transition-transform duration-300 ${
                      dragActive ? 'scale-125 rotate-12' : 'group-hover:scale-110'
                    }`} />
                    {dragActive && (
                      <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-pulse" />
                    )}
                  </div>
                )}
              </div>

              {/* Text */}
              {file ? (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-lg font-semibold text-green-700 flex items-center justify-center gap-2">
                    <span className="animate-pulse">✓</span>
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
                    onClick={(e) => {
                      e.preventDefault()
                      setFile(null)
                    }}
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700">
                    {dragActive ? '📥 Drop your video here!' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">
                    MP4, MOV, AVI, WebM supported
                  </p>
                </div>
              )}
            </label>

            {/* Animated Border Effect */}
            {dragActive && (
              <div className="absolute inset-0 rounded-2xl border-2 border-purple-500 animate-pulse pointer-events-none"></div>
            )}
          </div>

          {/* Platform Selection */}
          <div className="mt-8">
            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Target Platform
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['instagram', 'youtube_shorts', 'other'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`group relative py-4 px-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    platform === p
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 bg-white hover:shadow-md'
                  }`}
                >
                  {/* Icon */}
                  <div className={`text-3xl mb-2 transition-transform duration-300 ${
                    platform === p ? 'animate-bounce' : 'group-hover:scale-110'
                  }`}>
                    {platformIcons[p]}
                  </div>
                  
                  {/* Label */}
                  <div className={`text-sm font-semibold ${
                    platform === p ? 'text-white' : 'text-gray-700'
                  }`}>
                    {p === 'youtube_shorts' ? 'YouTube Shorts' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </div>

                  {/* Selection Indicator */}
                  {platform === p && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg animate-scale-in">
                      <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    </div>
                  )}

                  {/* Hover Glow */}
                  {platform !== p && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`mt-8 w-full relative overflow-hidden py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
              loading || !file
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95'
            }`}
          >
            {/* Animated Background */}
            {!loading && file && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x"></div>
            )}
            
            {/* Button Content */}
            <span className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-6 w-6" />
                  <span className="animate-pulse">Analyzing Magic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                  Analyze Video
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </>
              )}
            </span>

            {/* Shine Effect */}
            {!loading && file && (
              <div className="absolute inset-0 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
            )}
          </button>

          {/* Info Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Secure Upload</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-500"></span>
              <span>AI-Powered</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-1000"></span>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-slow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 5s ease infinite;
        }

        .animate-shine {
          animation: shine 3s infinite;
        }

        .animate-shake {
          animation: shake 0.5s;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}