"use client"

import { Card, CardContent } from "@/components/dashboard/ui/card"

export function WritingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="neumorphic">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">2,450</div>
          <div className="text-xs text-muted-foreground">Words Today</div>
        </CardContent>
      </Card>
      <Card className="neumorphic">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-500">7</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </CardContent>
      </Card>
      <Card className="neumorphic">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">3.2h</div>
          <div className="text-xs text-muted-foreground">Time Today</div>
        </CardContent>
      </Card>
      <Card className="neumorphic">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">85%</div>
          <div className="text-xs text-muted-foreground">Goal Progress</div>
        </CardContent>
      </Card>
    </div>
  )
}
