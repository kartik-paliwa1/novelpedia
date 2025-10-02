"use client"

import { useAuth } from "@/contexts/auth-context"

export function WelcomeSection() {
  const { user, isLoading } = useAuth()

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
            <h1 className="text-4xl font-bold gradient-heading">
              Welcome back, {isLoading ? 'Author' : user?.name || 'Author'}!
            </h1>
            <p className="text-muted-foreground text-lg">Here&#39;s what&#39;s happening with your novels today.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
