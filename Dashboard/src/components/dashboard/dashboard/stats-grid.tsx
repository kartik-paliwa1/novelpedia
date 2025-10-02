"use client"

import type React from "react"

import { ArrowDown, ArrowUp, BarChart3, BookOpen, DollarSign, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { cn } from "@/lib/utils"

export function StatsGrid() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Performance Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Views"
          value="68.2k"
          change={12.5}
          icon={<Users className="h-4 w-4" />}
          description="Last 30 days"
          color="blue"
        />

        <StatCard
          title="Engagement Rate"
          value="24.8%"
          change={-3.2}
          icon={<BarChart3 className="h-4 w-4" />}
          description="Comments per view"
          color="purple"
        />

        <StatCard
          title="Chapter Completion"
          value="68%"
          change={5.1}
          icon={<BookOpen className="h-4 w-4" />}
          description="Average read-through"
          color="green"
        />

        <StatCard
          title="Revenue"
          value="$342.58"
          change={28.4}
          icon={<DollarSign className="h-4 w-4" />}
          description="This month"
          color="amber"
        />
      </div>

      <Card className="neumorphic">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Reader Ratings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">4.7</span>
              <span className="text-muted-foreground">/5</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs w-6">5★</div>
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400/80 to-amber-400"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">75%</div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs w-6">4★</div>
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400/80 to-amber-400"
                    style={{ width: "20%" }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">20%</div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs w-6">3★</div>
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400/80 to-amber-400" style={{ width: "5%" }}></div>
                </div>
                <div className="text-xs text-muted-foreground">5%</div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs w-6">2★</div>
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400/80 to-amber-400" style={{ width: "0%" }}></div>
                </div>
                <div className="text-xs text-muted-foreground">0%</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs w-6">1★</div>
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400/80 to-amber-400" style={{ width: "0%" }}></div>
                </div>
                <div className="text-xs text-muted-foreground">0%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  description: string
  color?: "blue" | "green" | "purple" | "amber"
}

function StatCard({ title, value, change, icon, description, color = "blue" }: StatCardProps) {
  const colorStyles = {
    blue: {
      gradient: "from-blue-500/20 to-blue-600/20",
      text: "text-blue-500",
    },
    green: {
      gradient: "from-green-500/20 to-green-600/20",
      text: "text-green-500",
    },
    purple: {
      gradient: "from-purple-500/20 to-purple-600/20",
      text: "text-purple-500",
    },
    amber: {
      gradient: "from-amber-500/20 to-amber-600/20",
      text: "text-amber-500",
    },
  }

  const { gradient, text } = colorStyles[color]

  return (
    <Card className="neumorphic overflow-hidden">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className="p-6">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              <div className={cn("flex items-center text-xs", change > 0 ? "text-green-500" : "text-red-500")}>
                {change > 0 ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                {Math.abs(change)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>

          <div className={`h-full w-16 bg-gradient-to-b ${gradient} flex items-center justify-center`}>
            <div className={text}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
