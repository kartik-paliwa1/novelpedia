"use client"

import { Bell, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"

export function NotificationsSection() {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="h-7"></div>
      <Card className="neumorphic flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">Coming Soon</h3>
              <p className="text-muted-foreground text-xs">
                Notifications will be available soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
