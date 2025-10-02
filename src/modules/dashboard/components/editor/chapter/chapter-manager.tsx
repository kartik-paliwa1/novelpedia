"use client"

import { Button } from "@/common/components/ui/button"
import { Card, CardContent } from "@/common/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/common/components/ui/dropdown-menu"
import { Calendar, Edit3, Eye, MoreHorizontal, Plus } from "lucide-react"
import { StatusBadge } from "@/common/components/ui/status-badge"

const chapters = [
  {
    id: 1,
    title: "The Beginning",
    wordCount: 2500,
    status: "Published",
    lastEdited: "2 days ago",
    views: 1200,
  },
  {
    id: 2,
    title: "First Steps",
    wordCount: 3200,
    status: "Published",
    lastEdited: "1 week ago",
    views: 980,
  },
  {
    id: 3,
    title: "The Discovery",
    wordCount: 2800,
    status: "Draft",
    lastEdited: "3 hours ago",
    views: 0,
  },
]

export function ChapterManager() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chapters</h3>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Chapter
        </Button>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="neumorphic">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">
                      Chapter {chapter.id}: {chapter.title}
                    </h4>
                    <StatusBadge 
                      status={chapter.status === "Published" ? "Completed" : "Draft"}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{chapter.wordCount} words</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Edited {chapter.lastEdited}</span>
                    </div>
                    {chapter.views > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{chapter.views} views</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Move</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
