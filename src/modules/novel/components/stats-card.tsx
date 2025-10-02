//Not utilised in the current codebase, but can be used for displaying statistics in a card format.

import { cn } from '@/utils/utils'

interface StatsCardProps {
  title: string
  value: string
  subValue?: string
  change: number
  period: string
}

export function StatsCard({ title, value, subValue, change, period }: StatsCardProps) {
  const changeText = change === 0 ? "0.0%" : `${change > 0 ? "+" : ""}${change}%`
  const changeColor = change === 0 ? "text-muted-foreground" : change > 0 ? "text-primary" : "text-destructive"

  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="flex items-baseline gap-1">
        <div className="text-2xl font-bold">{value}</div>
        {subValue && <div className="text-sm text-muted-foreground">{subValue}</div>}
      </div>
      <div className={cn("text-xs", changeColor)}>
        {changeText} {period}
      </div>
    </div>
  )
}
