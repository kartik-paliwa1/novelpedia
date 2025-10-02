"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Check } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { FcGoogle } from 'react-icons/fc';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/account/settings" className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </Link>
            <div className="p-3 bg-blue-500 rounded-2xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Account & Security</h1>
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
          {/* Email Address */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Email Address</h3>
            <div className="relative">
              <input
                type="email"
                value="user@example.com"
                readOnly
                className="w-full bg-gray-800 text-gray-400 p-4 rounded-2xl text-lg border border-gray-700 pr-12"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="p-1 bg-green-500 rounded">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Change Email Button */}
          <button className="w-full bg-cyan-500 text-white py-4 px-6 rounded-2xl font-medium text-lg hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>Change Email</span>
          </button>

          {/* Change Password Button */}
          <button className="w-full bg-gray-800 border border-gray-700 text-gray-400 py-4 px-6 rounded-2xl font-medium text-lg hover:border-gray-600 transition-colors">
            Change Password
          </button>

          {/* Connected Accounts */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Connected Accounts</h3>
            <div className="space-y-3">
              {/* Connect Google */}
              <button className="w-full bg-gray-800 border border-gray-700 text-white py-4 px-6 rounded-2xl font-medium text-lg hover:border-gray-600 transition-colors flex items-center space-x-3">
                <FcGoogle className="w-6 h-6 text-red-500" />
                <span>Connect Google</span>
              </button>

              {/* Connect Discord */}
              <button className="w-full bg-gray-800 border border-gray-700 text-white py-4 px-6 rounded-2xl font-medium text-lg hover:border-gray-600 transition-colors flex items-center space-x-3">
                <FaDiscord className="w-6 h-6 text-indigo-400" />
                <span>Connect Discord</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
