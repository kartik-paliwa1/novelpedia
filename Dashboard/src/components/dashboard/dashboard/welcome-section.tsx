"use client"

import { Edit3, TrendingUp } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { Progress } from "@/components/dashboard/ui/progress"
import { useRouter } from "next/navigation"

export function WelcomeSection() {
  const router = useRouter()

  const handleNewChapter = () => {
    // Navigate to the first available novel, or just the editor if no novels
    router.push('/dashboard/editor')
  }

  const handleViewAnalytics = () => {
    // TODO: Navigate to analytics page when implemented
    console.log('Navigate to analytics')
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-card/80 p-8 hexagon-pattern">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Online now</span>
            </div>
            <h1 className="text-4xl font-bold gradient-heading">Welcome back, Author!</h1>
            <p className="text-muted-foreground text-lg">Here&#39;s what&#39;s happening with your novels today.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Weekly writing goal</span>
              <span className="text-primary font-semibold">4,200 / 7,000 words</span>
            </div>
            <Progress value={60} className="h-3" />
            <p className="text-xs text-muted-foreground">You&#39;re 60% towards your weekly goal. Keep it up!</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleNewChapter} className="gap-2 relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 shimmer"></div>
              <Edit3 className="h-4 w-4" />
              <span className="relative">New Chapter</span>
            </Button>
            <Button onClick={handleViewAnalytics} variant="outline" className="gap-2 bg-transparent cursor-pointer">
              <TrendingUp className="h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
