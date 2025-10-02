"use client"

import Link from "next/link"
import { ArrowLeft, Tag } from "lucide-react"

export default function AuthorPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/account/settings" className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </Link>
            <div className="p-3 bg-pink-600 rounded-2xl">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Author Settings</h1>
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
        <div className="flex flex-col items-center justify-center px-6 py-20">
          {/* Large Icon */}
          <div className="p-8 bg-pink-600 rounded-3xl mb-8">
            <Tag className="w-16 h-16 text-white" />
          </div>

          {/* Coming Soon Text */}
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Coming Soon</h2>

          {/* Description */}
          <p className="text-gray-400 text-center text-lg leading-relaxed max-w-sm">
            Manage your stories, track earnings, and view detailed analytics for your published content.
          </p>
        </div>
      </div>
    </div>
  )
}
