"use client"

import Link from "next/link"
import { ArrowLeft, Bell } from "lucide-react"
import { useState } from "react"

export default function NotificationsPage() {
  const [newComments, setNewComments] = useState(true)
  const [repliesToComments, setRepliesToComments] = useState(true)
  const [newChapters, setNewChapters] = useState(true)
  const [pollsAnnouncements, setPollsAnnouncements] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/account/settings" className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </Link>
            <div className="p-3 bg-orange-500 rounded-2xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Notification Preferences</h1>
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
          {/* New Comments/Reviews */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">New Comments/Reviews</h3>
              <p className="text-gray-400 text-sm">Get notified when someone comments on your content</p>
            </div>
            <button
              onClick={() => setNewComments(!newComments)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                newComments ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  newComments ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Replies to Comments */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Replies to Comments</h3>
              <p className="text-gray-400 text-sm">Get notified when someone replies to your comments</p>
            </div>
            <button
              onClick={() => setRepliesToComments(!repliesToComments)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                repliesToComments ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  repliesToComments ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* New Chapters from Followed Stories */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">New Chapters from Followed Stories</h3>
              <p className="text-gray-400 text-sm">Get notified when followed authors publish new chapters</p>
            </div>
            <button
              onClick={() => setNewChapters(!newChapters)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                newChapters ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  newChapters ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Polls & Announcements */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Polls & Announcements</h3>
              <p className="text-gray-400 text-sm">Get notified about platform updates and community polls</p>
            </div>
            <button
              onClick={() => setPollsAnnouncements(!pollsAnnouncements)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                pollsAnnouncements ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  pollsAnnouncements ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
