"use client"

import Link from "next/link"
import { ArrowLeft, Book } from "lucide-react"
import { useState } from "react"

export default function ReadingPage() {
  const [theme, setTheme] = useState("Dark")
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const [ttsSpeed, setTtsSpeed] = useState(1)
  const [autoMark, setAutoMark] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/account/settings" className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </Link>
            <div className="p-3 bg-green-500 rounded-2xl">
              <Book className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Reading Preferences</h1>
          </div>
          <div className="text-cyan-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Default Theme */}
          <div>
            <h2 className="text-white text-lg font-medium mb-4">Default Theme</h2>
            <div className="relative">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-800 text-white p-4 rounded-2xl text-lg font-medium appearance-none cursor-pointer border border-gray-700"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
                <option value="Auto">Auto</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Text-to-Speech Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Text-to-Speech Mode</h3>
              <p className="text-gray-400 text-sm">Enable audio narration for stories</p>
            </div>
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                ttsEnabled ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  ttsEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* TTS Speed */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">TTS Speed: {ttsSpeed}x</h3>
            <div className="relative">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={ttsSpeed}
                onChange={(e) => setTtsSpeed(Number.parseFloat(e.target.value))}
                className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer slider"
              />
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #06b6d4;
                  cursor: pointer;
                }
                .slider::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #06b6d4;
                  cursor: pointer;
                  border: none;
                }
              `}</style>
            </div>
          </div>

          {/* Auto-Mark As Read */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Auto-Mark As Read</h3>
              <p className="text-gray-400 text-sm">Automatically mark chapters as read when you finish them</p>
            </div>
            <button
              onClick={() => setAutoMark(!autoMark)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                autoMark ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  autoMark ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
