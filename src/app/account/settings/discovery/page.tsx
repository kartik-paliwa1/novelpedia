"use client"

import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { useState } from "react"

export default function DiscoveryPage() {
  const [selectedGenres, setSelectedGenres] = useState(["Fantasy", "Romance", "Mystery"])
  const [safeMode, setSafeMode] = useState(true)
  const [feedMode, setFeedMode] = useState("Trending")

  const genres = ["Fantasy", "Romance", "Sci-Fi", "Mystery", "Horror", "Comedy", "Drama", "Action", "Slice of Life"]

  const feedModes = ["Scroll", "Trending", "New", "For You"]

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/account/settings" className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </Link>
            <div className="p-3 bg-pink-500 rounded-2xl">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Discovery & Content Filters</h1>
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
          {/* Preferred Genres */}
          <div>
            <h2 className="text-white text-lg font-medium mb-4">Preferred Genres</h2>
            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    selectedGenres.includes(genre)
                      ? genre === "Mystery"
                        ? "bg-gray-800 text-white border-2 border-blue-500"
                        : "bg-cyan-500 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Safe Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Safe Mode (Hide NSFW)</h3>
              <p className="text-gray-400 text-sm">Filter out adult content from your feed</p>
            </div>
            <button
              onClick={() => setSafeMode(!safeMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                safeMode ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  safeMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Default Feed Mode */}
          <div>
            <h2 className="text-white text-lg font-medium mb-6">Default Feed Mode</h2>
            <div className="space-y-4">
              {feedModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFeedMode(mode)}
                  className="flex items-center space-x-3 w-full text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      feedMode === mode ? "border-cyan-500 bg-transparent" : "border-gray-500"
                    }`}
                  >
                    {feedMode === mode && <div className="w-2 h-2 bg-cyan-500 rounded-full" />}
                  </div>
                  <span className="text-white text-lg">{mode}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
