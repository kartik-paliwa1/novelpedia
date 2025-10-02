// Stats cards
"use client"

import { Card, CardContent } from "@/components/dashboard/ui/card"
import { Users, MessageSquare, TrendingUp, Award } from "lucide-react"
import { CommunityStats } from "@/types/community"

interface CommunityStatsProps {
  stats?: CommunityStats
}

const defaultStats: CommunityStats = {
  activeMembers: 2847,
  totalPosts: 1234,
  postsToday: 156,
  solvedQuestions: 89,
}

export function CommunityStatsComponent({ stats = defaultStats }: CommunityStatsProps) {
  const statItems = [
    {
      icon: Users,
      value: stats.activeMembers.toLocaleString(),
      label: "Active Members",
      color: "text-primary",
    },
    {
      icon: MessageSquare,
      value: stats.totalPosts.toLocaleString(),
      label: "Total Posts",
      color: "text-green-500",
    },
    {
      icon: TrendingUp,
      value: stats.postsToday,
      label: "Posts Today",
      color: "text-amber-500",
    },
    {
      icon: Award,
      value: stats.solvedQuestions,
      label: "Solved Questions",
      color: "text-purple-500",
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
