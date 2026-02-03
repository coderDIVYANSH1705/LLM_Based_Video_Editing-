'use client'

import { useState } from 'react'
import axios from 'axios'
import { Upload, Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function UploadSection({ onResults, loading, setLoading }: any) {
  const [file, setFile] = useState<File | null>(null)
  const [platform, setPlatform] = useState('instagram')
  const [error, setError] = useState('')

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
        timeout: 120000 // 2 minutes
      })
      onResults(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video (≤60s)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                MP4, MOV, AVI (max 100MB)
              </p>
            </label>
          </div>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Platform
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['instagram', 'youtube_shorts', 'other'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`py-3 px-4 rounded-lg border-2 transition ${
                  platform === p
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {p === 'youtube_shorts' ? 'YouTube Shorts' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Analyzing...
            </>
          ) : (
            'Analyze Video'
          )}
        </button>
      </div>
    </div>
  )
}
