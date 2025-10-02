"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { Badge } from "@/common/components/ui/badge"
import { CalendarDays, Trophy } from "lucide-react"

export function PromotionSection() {
  return (
    <Card className="h-full neumorphic">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="gradient-border">
          <div className="gradient-border-content p-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">CONTEST</Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3 mr-1" />
                Ends in 14 days
              </div>
            </div>

            <h3 className="text-sm font-medium mt-3">Summer Fantasy Contest</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Submit your fantasy novel for a chance to win $5,000 and a publishing contract.
            </p>

            <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
              Apply Now
            </Button>
          </div>
        </div>

        <div className="gradient-border">
          <div className="gradient-border-content p-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">FEATURED</Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3 mr-1" />3 spots left
              </div>
            </div>

            <h3 className="text-sm font-medium mt-3">Homepage Feature</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Get your novel featured on the homepage for increased visibility and readers.
            </p>

            <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent glow">
              Apply Now
            </Button>
          </div>
        </div>

        <Button variant="ghost" className="w-full text-primary" size="sm">
          View All Opportunities
        </Button>
      </CardContent>
    </Card>
  )
}
