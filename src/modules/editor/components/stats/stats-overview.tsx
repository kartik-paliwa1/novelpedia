"use client"

import { BookOpen, Heart, Star, TrendingUp } from "lucide-react"
import { Card, CardContent } from '@/common/components/ui/card'

interface StatsOverviewProps {
  totalNovels: number
}

export function StatsOverview({ totalNovels }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="neumorphic">
        <CardContent className="p-4 text-center">
          <BookOpen className="h-5 w-5 text-primary mx-auto mb-2" />
          <div className="text-lg font-bold">{totalNovels}</div>
          <div className="text-xs text-muted-foreground">Total Novels</div>
        </CardContent>
      </Card>
      <Card className="neumorphic">
        <CardContent className="p-4 text-center">
          <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-2" />
          <div className="text-lg font-bold">36.4K</div>
          <div className="text-xs text-muted-foreground">Total Views</div>
        </CardContent>
      </Card>
      <Card className="neumorphic">
        <CardContent className="p-4 text-center">
          <Heart className="h-5 w-5 text-red-500 mx-auto mb-2" />
          <div className="text-lg font-bold">1,137</div>
          <div className="text-xs text-muted-foreground">Collections</div>
        </CardContent>
      </Card>
      <Card className="neumorphic">
        <CardContent className="p-4 text-center">
          <Star className="h-5 w-5 text-amber-500 mx-auto mb-2" />
          <div className="text-lg font-bold">4.8</div>
          <div className="text-xs text-muted-foreground">Avg Rating</div>
        </CardContent>
      </Card>
    </div>
  )
}
