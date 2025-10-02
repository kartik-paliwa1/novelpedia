//not used in the current codebase, for future charts.

"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = [
  { date: "10 Jul", readers: 0, effective: 0, collections: 0 },
  { date: "11 Jul", readers: 2, effective: 1, collections: 0 },
  { date: "12 Jul", readers: 5, effective: 3, collections: 1 },
  { date: "13 Jul", readers: 8, effective: 5, collections: 2 },
  { date: "14 Jul", readers: 6, effective: 4, collections: 1 },
  { date: "15 Jul", readers: 10, effective: 7, collections: 3 },
  { date: "16 Jul", readers: 12, effective: 8, collections: 4 },
]

export function ReaderChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" vertical={false} />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="readers"
          name="READER COUNT"
          stroke="hsl(var(--destructive))"
          activeDot={{ r: 8 }}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="effective"
          name="EFFECTIVE READER COUNT"
          stroke="hsl(var(--warning), #FFA940)" // fallback optional
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="collections"
          name="COLLECTIONS"
          stroke="hsl(var(--primary))"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
