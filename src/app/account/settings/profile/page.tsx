"use client"

import Link from "next/link"
import { ArrowLeft, User, Upload } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const [username, setUsername] = useState("YourUsername")
  const [bio, setBio] = useState("")
  const [publicProfile, setPublicProfile] = useState(false)

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
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
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
          {/* Username */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Username</h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="YourUsername"
              className="w-full bg-gray-800 text-gray-400 p-4 rounded-2xl text-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Avatar */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Avatar</h3>
            <button className="w-full bg-gray-800 border border-gray-700 text-gray-400 py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 hover:border-gray-600 transition-colors">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload Avatar</span>
            </button>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Bio</h3>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              rows={6}
              className="w-full bg-gray-800 text-gray-400 p-4 rounded-2xl text-lg border border-gray-700 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Public Profile */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">Public Profile</h3>
              <p className="text-gray-400 text-sm">Make your profile visible to other users</p>
            </div>
            <button
              onClick={() => setPublicProfile(!publicProfile)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                publicProfile ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  publicProfile ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
