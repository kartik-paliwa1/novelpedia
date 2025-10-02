import Link from "next/link"
import { Settings, Shield, User, Bell, Book, Search, Eye, Tag, ChevronRight } from "lucide-react"

export default function SettingsPage() {
  const settingsItems = [
    {
      title: "Account & Security",
      href: "/account/settings/account",
      icon: Shield,
      iconBg: "bg-blue-500",
    },
    {
      title: "Profile Settings",
      href: "/account/settings/profile",
      icon: User,
      iconBg: "bg-green-500",
    },
    {
      title: "Notification Preferences",
      href: "/account/settings/notifications",
      icon: Bell,
      iconBg: "bg-orange-500",
    },
    {
      title: "Reading Preferences",
      href: "/account/settings/reading",
      icon: Book,
      iconBg: "bg-green-600",
    },
    {
      title: "Discovery & Content Filters",
      href: "/account/settings/discovery",
      icon: Search,
      iconBg: "bg-pink-500",
    },
    {
      title: "Privacy & Visibility",
      href: "/account/settings/privacy",
      icon: Eye,
      iconBg: "bg-purple-500",
    },
    {
      title: "Author Settings",
      href: "/account/settings/author",
      icon: Tag,
      iconBg: "bg-pink-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 pb-4">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-semibold text-cyan-400">Settings</h1>
        </div>

        {/* Settings Items */}
        <div className="px-4 space-y-3 pb-10">
          {settingsItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${item.iconBg}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-medium text-lg">{item.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
