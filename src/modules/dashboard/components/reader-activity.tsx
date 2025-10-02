"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "Mon", readers: 120, comments: 15, collections: 5 },
  { date: "Tue", readers: 140, comments: 20, collections: 8 },
  { date: "Wed", readers: 180, comments: 25, collections: 12 },
  { date: "Thu", readers: 250, comments: 30, collections: 18 },
  { date: "Fri", readers: 280, comments: 40, collections: 24 },
  { date: "Sat", readers: 350, comments: 45, collections: 28 },
  { date: "Sun", readers: 400, comments: 60, collections: 32 },
]

export function ReaderActivity() {
  const [period, setPeriod] = useState("week")

  return (
    <Card className="neumorphic">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Reader Activity</CardTitle>
        <Tabs value={period} onValueChange={setPeriod} className="w-auto">
          <TabsList className="bg-card border">
            <TabsTrigger value="day" className="text-xs">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="text-xs">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReaders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="readers"
                name="Readers"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorReaders)"
              />
              <Area
                type="monotone"
                dataKey="comments"
                name="Comments"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorComments)"
              />
              <Area
                type="monotone"
                dataKey="collections"
                name="Collections"
                stroke="#F59E0B"
                fillOpacity={1}
                fill="url(#colorCollections)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg neumorphic-inset">
            <div className="text-sm text-muted-foreground">Total Readers</div>
            <div className="text-2xl font-bold mt-1">1,720</div>
          </div>
          <div className="text-center p-3 rounded-lg neumorphic-inset">
            <div className="text-sm text-muted-foreground">Comments</div>
            <div className="text-2xl font-bold mt-1">235</div>
          </div>
          <div className="text-center p-3 rounded-lg neumorphic-inset">
            <div className="text-sm text-muted-foreground">Collections</div>
            <div className="text-2xl font-bold mt-1">127</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
