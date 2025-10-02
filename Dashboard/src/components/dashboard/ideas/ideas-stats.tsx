// Statistics cards showing videos, articles, podcasts, and prompts counts
"use client"

import { Card, CardContent } from "@/components/dashboard/ui/card"
import { Video, FileText, Headphones, Lightbulb } from "lucide-react"
import { ResourceStats } from "@/types/ideas"

interface IdeasStatsProps {
  stats?: ResourceStats
}

const defaultStats: ResourceStats = {
  videos: 24,
  articles: 18,
  podcasts: 12,
  prompts: 0, // MVP: Coming soon
}

export function IdeasStats({ stats = defaultStats }: IdeasStatsProps) {
  const statItems = [
    {
      icon: Video,
      value: stats.videos,
      label: "Video Tutorials",
      color: "text-red-500",
    },
    {
      icon: FileText,
      value: stats.articles,
      label: "Articles",
      color: "text-blue-500",
    },
    {
      icon: Headphones,
      value: stats.podcasts,
      label: "Podcasts",
      color: "text-green-500",
    },
    {
      icon: Lightbulb,
      value: "Soon",
      label: "Writing Prompts",
      color: "text-amber-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon
        return (
          <Card key={index} className="neumorphic stat-card">
            <CardContent className="p-4 text-center">
              <Icon className={`h-5 w-5 ${item.color} mx-auto mb-2`} />
              <div className="text-lg font-bold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
