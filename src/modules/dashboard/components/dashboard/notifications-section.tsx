"use client"

import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { Badge } from "@/common/components/ui/badge"
import clsx from "clsx"

export function NotificationsSection() {
  return (
    <Card className="h-full neumorphic">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </CardTitle>
        <Badge variant="outline" className="rounded-full bg-primary text-white">
          3 new
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        <div className="space-y-0 px-6">
          <NotificationItem
            title="Payment Processed"
            message="You received $42.50 in royalties"
            time="2 hours ago"
            isNew
          />
          <NotificationItem
            title="Contract Update"
            message="Your publishing contract has been renewed"
            time="1 day ago"
            isNew
          />
          <NotificationItem
            title="System Maintenance"
            message="Scheduled maintenance on Sunday 2-4 AM"
            time="3 days ago"
          />
          <NotificationItem
            title="Chapter Approved"
            message="Your chapter 'The Dark Forest' is now live"
            time="Yesterday"
            isNew
          />
          <NotificationItem title="Milestone Reached" message="Your novel reached 10,000 readers!" time="2 days ago" />
        </div>

        <div className="border-t pt-4 px-6">
          <Button variant="ghost" className="w-full text-primary" size="sm">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface NotificationItemProps {
  title: string
  message: string
  time: string
  isNew?: boolean
}

function NotificationItem({ title, message, time, isNew = false }: NotificationItemProps) {
  return (
    <div
      className={clsx(
        "flex items-start gap-3 py-3 border-b border-border px-3 rounded-md transition-colors duration-300 hover:bg-secondary",
        {
          "bg-primary/5": isNew,
        }
      )}
    >
      <div className={clsx("mt-1 h-2 w-2 rounded-full", isNew ? "bg-primary" : "bg-transparent")} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{title}</h4>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{message}</p>
      </div>
    </div>
  )
}
