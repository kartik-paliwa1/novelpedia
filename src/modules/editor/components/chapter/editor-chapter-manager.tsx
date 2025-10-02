"use client"

import type React from "react"

import { useState } from "react"
import { Button } from '@/common/components/ui/button'
import { Card, CardContent } from '@/common/components/ui/card'
import { Badge } from '@/common/components/ui/badge'
import { Input } from '@/common/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu'
import { formatDate } from '@/utils/date-formatter'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog'
import {
  Calendar,
  Edit3,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  GripVertical,
  Trash2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Chapter {
  id: number
  title: string
  wordCount: number
  publishedAt: string
  status: "published" | "draft"
  order: number
}

interface EditorChapterManagerProps {
  chapters: Chapter[]
  onChaptersChange: (chapters: Chapter[]) => void
  onEditChapter: (chapterId: number) => void
  onPreviewChapter: (chapterId: number) => void
}

const CHAPTERS_PER_PAGE = 8

export function EditorChapterManager({
  chapters,
  onChaptersChange,
  onEditChapter,
  onPreviewChapter,
}: EditorChapterManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [draggedChapter, setDraggedChapter] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null)

  // Filter and paginate chapters
  const filteredChapters = chapters.filter((chapter) => chapter.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const totalPages = Math.ceil(filteredChapters.length / CHAPTERS_PER_PAGE)
  const startIndex = (currentPage - 1) * CHAPTERS_PER_PAGE
  const paginatedChapters = filteredChapters.slice(startIndex, startIndex + CHAPTERS_PER_PAGE)

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: Date.now(),
      title: `Chapter ${chapters.length + 1}`,
      wordCount: 0,
      publishedAt: "Just now",
      status: "draft",
      order: chapters.length + 1,
    }
    onChaptersChange([...chapters, newChapter])
  }

  const handleDeleteChapter = (chapterId: number) => {
    const updatedChapters = chapters
      .filter((chapter) => chapter.id !== chapterId)
      .map((chapter, index) => ({ ...chapter, order: index + 1 }))

    onChaptersChange(updatedChapters)
    setShowDeleteDialog(null)
  }

  const handleDragStart = (chapterId: number) => {
    setDraggedChapter(chapterId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetChapterId: number) => {
    e.preventDefault()
    if (!draggedChapter || draggedChapter === targetChapterId) return

    const draggedIndex = chapters.findIndex((c) => c.id === draggedChapter)
    const targetIndex = chapters.findIndex((c) => c.id === targetChapterId)

    const newChapters = [...chapters]
    const [draggedItem] = newChapters.splice(draggedIndex, 1)
    newChapters.splice(targetIndex, 0, draggedItem)

    // Update order numbers
    const updatedChapters = newChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }))

    onChaptersChange(updatedChapters)
    setDraggedChapter(null)
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Chapters ({chapters.length})</h3>
          <p className="text-sm text-muted-foreground">Manage your novel&#39;s chapters - drag to reorder, click to edit</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddChapter} className="gap-2">
            <Plus className="h-4 w-4" />
            New Chapter
          </Button>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedChapters.map((chapter) => (
          <Card
            key={chapter.id}
            className="neumorphic hover:shadow-lg transition-all duration-300 cursor-move"
            draggable
            onDragStart={() => handleDragStart(chapter.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, chapter.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing mt-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium truncate">
                      Chapter {chapter.order}: {chapter.title}
                    </h4>
                    {chapter.status === "published" && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{chapter.wordCount} words</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(chapter.publishedAt)}</span>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        chapter.status === "published"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }
                    >
                      {chapter.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditChapter(chapter.id)
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEditChapter(chapter.id)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Chapter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPreviewChapter(chapter.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Chapter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowDeleteDialog(chapter.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Chapter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + CHAPTERS_PER_PAGE, filteredChapters.length)} of{" "}
            {filteredChapters.length} chapters
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chapter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chapter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => showDeleteDialog && handleDeleteChapter(showDeleteDialog)}>
              Delete Chapter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
