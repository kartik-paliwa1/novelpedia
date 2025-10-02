"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { time: "21:00", percentage: 10 },
  { time: "22:00", percentage: 15 },
  { time: "23:00", percentage: 8 },
  { time: "00:00", percentage: 2 },
  { time: "01:00", percentage: 5 },
  { time: "02:00", percentage: 7 },
  { time: "03:00", percentage: 7 },
  { time: "04:00", percentage: 7 },
  { time: "05:00", percentage: 5 },
  { time: "06:00", percentage: 2 },
  { time: "07:00", percentage: 2 },
  { time: "08:00", percentage: 2 },
  { time: "09:00", percentage: 3 },
  { time: "10:00", percentage: 4 },
  { time: "11:00", percentage: 6 },
  { time: "12:00", percentage: 6 },
  { time: "13:00", percentage: 3 },
  { time: "14:00", percentage: 12 },
]

export function ReadingTimeDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">DISTRIBUTION OF READING TIME</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 25,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="percentage" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
