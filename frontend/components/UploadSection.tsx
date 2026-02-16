'use client'

import { useState } from 'react'
import axios from 'axios'
import { Upload, Loader2, Video, Sparkles, CheckCircle2, AlertCircle, Instagram, Youtube, Film } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function UploadSection({ onResults, loading, setLoading }: any) {
  const [file, setFile] = useState<File | null>(null)
  const [platform, setPlatform] = useState('instagram')
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

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
      } else {
        setError('Please upload a valid video file')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setError('')
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

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-blue-500 to-blue-600' },
    { id: 'youtube_shorts', name: 'YouTube Shorts', icon: Youtube, color: 'from-blue-600 to-cyan-600' },
    { id: 'other', name: 'Other', icon: Film, color: 'from-cyan-500 to-blue-500' }
  ]

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative group transition-all duration-300 ${
          dragActive ? 'scale-[1.02]' : ''
        }`}
      >
        {/* Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-2xl blur-xl transition-opacity duration-300 ${
          dragActive ? 'opacity-60' : 'opacity-20 group-hover:opacity-40'
        }`}></div>
        
        <div className={`relative bg-white/90 backdrop-blur-xl rounded-2xl border transition-all duration-300 ${
          dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : file
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-blue-200 hover:border-blue-300'
        }`}>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            id="video-upload"
          />
          
          <label htmlFor="video-upload" className="cursor-pointer block p-12">
            <div className="flex flex-col items-center gap-6">
              {/* Icon */}
              <div className="relative">
                {file ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-50"></div>
                    <CheckCircle2 className="relative h-20 w-20 text-emerald-400" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl transition-opacity ${
                      dragActive ? 'opacity-60' : 'opacity-30'
                    }`}></div>
                    <Upload className={`relative h-20 w-20 text-blue-600 transition-transform duration-300 ${
                      dragActive ? 'scale-110 rotate-12' : 'group-hover:scale-105'
                    }`} />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="text-center">
                {file ? (
                  <>
                    <p className="text-xl font-semibold text-blue-900 mb-2">{file.name}</p>
                    <p className="text-sm text-blue-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      type="button"
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        setFile(null)
                      }}
                    >
                      Choose different file
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-semibold text-blue-900 mb-2">
                      {dragActive ? 'Drop your video here' : 'Upload your video'}
                    </p>
                    <p className="text-sm text-blue-600">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-xs text-blue-500 mt-2">
                      MP4, MOV, AVI • Max 100MB • Up to 60 seconds
                    </p>
                  </>
                )}
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-4">
          Select Platform
        </label>
        <div className="grid grid-cols-3 gap-4">
          {platforms.map((p) => {
            const Icon = p.icon
            const isSelected = platform === p.id
            
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`relative group p-6 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50 scale-105'
                    : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                {/* Glow Effect */}
                {isSelected && (
                  <div className={`absolute -inset-1 bg-gradient-to-r ${p.color} rounded-xl blur-xl opacity-30`}></div>
                )}
                
                <div className="relative flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${p.color} ${
                    isSelected ? 'opacity-100' : 'opacity-50 group-hover:opacity-70'
                  } transition-opacity`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    isSelected ? 'text-blue-900' : 'text-blue-600 group-hover:text-blue-700'
                  }`}>
                    {p.name}
                  </span>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="relative">
          <div className="absolute -inset-1 bg-red-500 rounded-xl blur-xl opacity-30"></div>
          <div className="relative bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`relative w-full group overflow-hidden rounded-xl transition-all duration-300 ${
          loading || !file
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {/* Glow Effect */}
        {!loading && file && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
        )}
        
        <div className={`relative py-4 px-6 rounded-xl font-semibold text-lg ${
          loading || !file
            ? 'bg-blue-200 text-blue-400'
            : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white'
        }`}>
          <span className="flex items-center justify-center gap-3">
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Analyze Video
                <Sparkles className="h-5 w-5" />
              </>
            )}
          </span>
        </div>
      </button>

      {/* Info Footer */}
      <div className="flex items-center justify-center gap-6 text-xs text-blue-600">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <span>AI-Powered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <span>Instant Results</span>
        </div>
      </div>
    </div>
  )
}
