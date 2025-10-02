//  Top contributors widget
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/modules/dashboard/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/dashboard/components/ui/avatar"
import { TopContributor } from "@/types/community"

interface TopContributorsProps {
  contributors?: TopContributor[]
}

const defaultContributors: TopContributor[] = [
  { name: "Emma Thompson", posts: 45, reputation: 2100 },
  { name: "Sarah Chen", posts: 38, reputation: 1250 },
  { name: "Mike Rodriguez", posts: 29, reputation: 890 },
]

export function TopContributors({ contributors = defaultContributors }: TopContributorsProps) {
  return (
    <Card className="neumorphic">
      <CardHeader>
        <CardTitle className="text-base">Top Contributors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contributors.map((user, index) => (
          <div key={user.name} className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {index + 1}
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.posts} posts</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
