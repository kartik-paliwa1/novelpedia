"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Trophy, Sparkles } from "lucide-react"

export function PromotionSection() {
  return (
    <Card className="h-full neumorphic">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold mb-1">Coming Soon</h3>
            <p className="text-muted-foreground text-xs">
              Contests and opportunities will be available soon.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
