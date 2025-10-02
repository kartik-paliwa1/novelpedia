"use client"

import { useState } from "react"
import { BookOpen, ChevronRight, Clock, Star, Users } from "lucide-react"
import { Button } from "@/common/components/ui/button"
import { Badge } from "@/common/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select"
import { formatDate } from '@/utils/date-formatter'

const novels = [
  {
    id: 1,
    title: "The Crystal Chronicles",
    genre: "Fantasy • Adventure",
    status: "ONGOING",
    chapters: 17,
    readers: "10.8k",
    rating: 4.7,
    lastUpdated: "3 days ago",
    progress: 68,
    cover: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 2,
    title: "Neon Shadows",
    genre: "Sci-Fi • Thriller",
    status: "DRAFT",
    chapters: 8,
    readers: "2.1k",
    rating: 4.2,
    lastUpdated: "1 week ago",
    progress: 32,
    cover: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 3,
    title: "Hearts in Harmony",
    genre: "Romance • Drama",
    status: "COMPLETED",
    chapters: 45,
    readers: "25.6k",
    rating: 4.9,
    lastUpdated: "2 months ago",
    progress: 100,
    cover: "/placeholder.svg?height=300&width=200",
  },
]

export function NovelOverview() {
  const [selectedNovelId, setSelectedNovelId] = useState(1)
  const selectedNovel = novels.find((novel) => novel.id === selectedNovelId) || novels[0]

  return (
    <div className="gradient-border">
      <div className="gradient-border-content">
        {/* Novel Selector */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Novel Overview</h2>
            <Select
              value={selectedNovelId.toString()}
              onValueChange={(value) => setSelectedNovelId(Number.parseInt(value))}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a novel" />
              </SelectTrigger>
              <SelectContent>
                {novels.map((novel) => (
                  <SelectItem key={novel.id} value={novel.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{novel.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {novel.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/4 h-48 md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 md:bg-gradient-to-r z-10"></div>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedNovel.cover})` }}
            ></div>
            <div className="absolute bottom-4 left-4 z-20 md:hidden">
              <h3 className="text-lg font-bold text-white">{selectedNovel.title}</h3>
              <p className="text-xs text-white/80">{selectedNovel.genre}</p>
            </div>
          </div>

          <div className="p-6 w-full md:w-3/4">
            <div className="hidden md:block mb-2">
              <Badge
                variant="outline"
                className={`${
                  selectedNovel.status === "COMPLETED"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : selectedNovel.status === "DRAFT"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                {selectedNovel.status}
              </Badge>
            </div>

            <div className="hidden md:block">
              <h3 className="text-xl font-bold mb-1">{selectedNovel.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{selectedNovel.genre}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="neumorphic p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">Chapters</span>
                </div>
                <div className="text-2xl font-bold">{selectedNovel.chapters}</div>
              </div>

              <div className="neumorphic p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Readers</span>
                </div>
                <div className="text-2xl font-bold">{selectedNovel.readers}</div>
              </div>

              <div className="neumorphic p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Star className="h-4 w-4" />
                  <span className="text-xs">Rating</span>
                </div>
                <div className="text-2xl font-bold">{selectedNovel.rating}</div>
              </div>

              <div className="neumorphic p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Last Updated</span>
                </div>
                <div className="text-sm font-medium">{formatDate(selectedNovel.lastUpdated)}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button variant="ghost" size="sm" className="text-primary">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
