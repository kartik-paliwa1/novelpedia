"use client"

import { useEffect, useMemo, useState } from "react"
import type React from "react"

import { ArrowDown, ArrowUp, BarChart3, BookOpen, DollarSign, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card"
import { api } from "@/services/api"
import type { DashboardStats } from "@/types/dashboard"
import { cn } from "@/utils/utils"

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

const formatCompactNumber = (value: number) => {
  if (!Number.isFinite(value)) return "0"
  return compactNumberFormatter.format(value)
}

const formatCurrency = (value: number) => {
  if (!Number.isFinite(value)) return "$0.00"
  return currencyFormatter.format(value)
}

const formatPercent = (value: number) => {
  if (!Number.isFinite(value)) return "0.0%"
  return `${value.toFixed(1)}%`
}

export function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadStats = async () => {
      try {
        const response = await api.getDashboardStats()
        if (mounted) {
          setStats(response.data as DashboardStats)
          setError(null)
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
        if (mounted) {
          setError("Unable to load performance metrics right now.")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadStats()

    return () => {
      mounted = false
    }
  }, [])

  const metrics = useMemo(() => {
    if (!stats?.performance) return []

    // Helper function to safely get metric data with defaults
    const safeMetric = (metric: any) => ({
      value: Number.isFinite(metric?.value) ? metric.value : 0,
      change: Number.isFinite(metric?.change) ? metric.change : 0,
      description: metric?.description || "No data available",
    })

    return [
      {
        key: "totalViews",
        title: "Total Views",
        value: formatCompactNumber(safeMetric(stats.performance.totalViews).value),
        change: safeMetric(stats.performance.totalViews).change,
        description: safeMetric(stats.performance.totalViews).description,
        icon: <Users className="h-4 w-4" />,
        color: "blue" as const,
      },
      {
        key: "engagementRate",
        title: "Engagement Rate",
        value: formatPercent(safeMetric(stats.performance.engagementRate).value),
        change: safeMetric(stats.performance.engagementRate).change,
        description: safeMetric(stats.performance.engagementRate).description,
        icon: <BarChart3 className="h-4 w-4" />,
        color: "purple" as const,
      },
      {
        key: "chapterCompletion",
        title: "Chapter Completion",
        value: formatPercent(safeMetric(stats.performance.chapterCompletion).value),
        change: safeMetric(stats.performance.chapterCompletion).change,
        description: safeMetric(stats.performance.chapterCompletion).description,
        icon: <BookOpen className="h-4 w-4" />,
        color: "green" as const,
      },
      {
        key: "estimatedRevenue",
        title: "Revenue",
        value: formatCurrency(safeMetric(stats.performance.estimatedRevenue).value),
        change: safeMetric(stats.performance.estimatedRevenue).change,
        description: safeMetric(stats.performance.estimatedRevenue).description,
        icon: <DollarSign className="h-4 w-4" />,
        color: "amber" as const,
      },
    ]
  }, [stats])

  const ratingInfo = useMemo(() => {
    if (!stats) {
      return { total: 0, bars: [] as { star: number; percentage: number; count: number }[] }
    }

    const total = Object.values(stats.ratings.distribution).reduce((acc, value) => acc + value, 0)
    const bars = [5, 4, 3, 2, 1].map((star) => {
      const count = stats.ratings.distribution[String(star)] ?? 0
      const percentage = total > 0 ? (count / total) * 100 : 0
      return { star, percentage, count }
    })

    return { total, bars }
  }, [stats])

  const showSkeleton = loading && !stats
  const showErrorState = !loading && !!error && !stats

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Performance Metrics</h2>
      {error && !loading && stats && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showSkeleton && Array.from({ length: 4 }).map((_, index) => <StatSkeleton key={`skeleton-${index}`} />)}

        {showErrorState && <ErrorStateCard message={error ?? "Metrics are currently unavailable."} />}

        {!showSkeleton && !showErrorState &&
          metrics.map((metric) => (
            <StatCard
              key={metric.key}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
              description={metric.description}
              color={metric.color}
            />
          ))}
      </div>

      <Card className="neumorphic">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Reader Ratings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {showSkeleton ? (
            <RatingSkeleton />
          ) : showErrorState ? (
            <p className="text-sm text-red-400">{error ?? "Rating insights are currently unavailable."}</p>
          ) : stats ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {Number.isFinite(stats.ratings.averageRating) 
                      ? stats.ratings.averageRating.toFixed(1) 
                      : "0.0"}
                  </span>
                  <span className="text-muted-foreground">/5</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Based on {Number.isFinite(stats.ratings.totalReviews) ? stats.ratings.totalReviews : 0}{" "}
                  {(stats.ratings.totalReviews || 0) === 1 ? "review" : "reviews"}
                </span>
              </div>

              <div className="flex-1 space-y-1.5">
                {ratingInfo.total > 0 ? (
                  ratingInfo.bars.map((bar) => (
                    <div key={bar.star} className="flex items-center gap-2">
                      <div className="text-xs w-6">{bar.star}★</div>
                      <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400/80 to-amber-400"
                          style={{ width: `${bar.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">{Math.round(bar.percentage)}%</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No ratings have been collected yet.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Metrics will appear once data is available.</p>
          )}
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

  const resolvedChangeRaw = typeof change === "number" ? change : Number(change ?? 0)
  const resolvedChange = Number.isFinite(resolvedChangeRaw) ? resolvedChangeRaw : 0

  const changeColor = resolvedChange > 0 ? "text-green-500" : resolvedChange < 0 ? "text-red-500" : "text-muted-foreground"
  
  // Safe number formatting with fallback for edge cases
  const safeAbsChange = Math.abs(resolvedChange)
  const changeValue = Number.isFinite(safeAbsChange) 
    ? safeAbsChange.toLocaleString(undefined, {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
      })
    : "0"

  return (
    <Card className="neumorphic overflow-hidden">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className="p-6">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              <div className={cn("flex items-center text-xs", changeColor)}>
                {resolvedChange > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                ) : resolvedChange < 0 ? (
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                ) : (
                  <span className="mr-0.5">±</span>
                )}
                {changeValue}%
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

function StatSkeleton() {
  return (
    <Card className="neumorphic overflow-hidden">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className="p-6 w-full">
            <div className="space-y-3 animate-pulse">
              <div className="h-3 w-24 rounded bg-secondary/60" />
              <div className="h-6 w-32 rounded bg-secondary/60" />
              <div className="h-3 w-20 rounded bg-secondary/60" />
            </div>
          </div>
          <div className="h-full w-16 bg-secondary/40" />
        </div>
      </CardContent>
    </Card>
  )
}

function RatingSkeleton() {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-16 rounded bg-secondary/60" />
        <div className="h-3 w-24 rounded bg-secondary/60" />
      </div>
      <div className="flex-1 space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-2 w-full rounded-full bg-secondary/40" />
        ))}
      </div>
    </div>
  )
}

function ErrorStateCard({ message }: { message: string }) {
  return (
    <div className="md:col-span-2">
      <Card className="neumorphic border border-red-500/40 bg-background/80">
        <CardContent className="p-6">
          <p className="text-sm text-red-400">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
