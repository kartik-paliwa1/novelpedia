"use client"

import Link from "next/link"
import { ArrowLeft, Eye, Download } from "lucide-react"
import { useState } from "react"

export default function PrivacyPage() {
  const [profilePrivate, setProfilePrivate] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const [showFollowedAuthors, setShowFollowedAuthors] = useState(true)
  const [showCollections, setShowCollections] = useState(true)
  const [betaFeatures, setBetaFeatures] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/account/settings" className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </Link>
            <div className="p-3 bg-purple-500 rounded-2xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Privacy & Visibility</h1>
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
          {/* Make Profile Private */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Make Profile Private</h3>
              <p className="text-gray-400 text-sm">Only you can see your profile information</p>
            </div>
            <button
              onClick={() => setProfilePrivate(!profilePrivate)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                profilePrivate ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  profilePrivate ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Show Comments */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Show Comments</h3>
              <p className="text-gray-400 text-sm">Display your comments on your profile</p>
            </div>
            <button
              onClick={() => setShowComments(!showComments)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                showComments ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  showComments ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Show Followed Authors */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Show Followed Authors</h3>
              <p className="text-gray-400 text-sm">Display authors you follow on your profile</p>
            </div>
            <button
              onClick={() => setShowFollowedAuthors(!showFollowedAuthors)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                showFollowedAuthors ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  showFollowedAuthors ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Show Collections */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Show Collections</h3>
              <p className="text-gray-400 text-sm">Display your story collections publicly</p>
            </div>
            <button
              onClick={() => setShowCollections(!showCollections)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                showCollections ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  showCollections ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Opt-in to Beta Features */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Opt-in to Beta Features</h3>
              <p className="text-gray-400 text-sm">Get early access to new features</p>
            </div>
            <button
              onClick={() => setBetaFeatures(!betaFeatures)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                betaFeatures ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  betaFeatures ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Export Data Button */}
          <div className="pt-8">
            <button className="w-full bg-transparent border-2 border-gray-600 text-white py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 hover:border-gray-500 transition-colors">
              <Download className="w-5 h-5" />
              <span className="font-medium">Export Data (JSON/CSV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
