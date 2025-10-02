//Not utilised in the current codebase, for future charts.

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "MALE", value: 13.04, color: "hsl(var(--primary))" },
  { name: "FEMALE", value: 0, color: "hsl(var(--destructive))" },
  { name: "UNKNOWN", value: 86.96, color: "hsl(var(--muted))" },
]

export function GenderDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">GENDER</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value, entry, index) => (
                  <span className="text-xs">
                    {value}: {data[index].value}%
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
