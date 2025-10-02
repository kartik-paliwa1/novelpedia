"use client"

import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Badge } from "@/components/dashboard/ui/badge"

export function NotificationsTab() {
  return (
    <Card className="novel-card">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Bell className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Notifications</CardTitle>
        <Badge variant="outline" className="mx-auto w-fit">
          Coming Soon
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-muted-foreground">
        <p>
          Personalized notification controls and delivery preferences are on the way. Soon you&apos;ll be able to
          choose exactly how you stay informed about comments, followers, milestones, and more.
        </p>
        <p className="text-sm">
          We&apos;re building a smarter notification system that keeps authors in the loop without the noise. Stay tuned!
        </p>
      </CardContent>
    </Card>
  )
}
