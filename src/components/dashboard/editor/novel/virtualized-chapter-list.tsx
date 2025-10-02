"use client"

import { useEffect, useRef, useState } from "react"
import { Chapter } from "@/types/editor"
import { Button } from "@/components/dashboard/ui/button"
import { GripVertical, Edit3, Trash2, MoreHorizontal, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu"

interface VirtualizedChapterListProps {
  chapters: Chapter[]
  onEdit: (chapterId: number) => void
  onDelete: (chapterId: number) => void
  onPublish?: (chapterId: number) => void
  onDragStart?: (chapterId: number) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, chapterId: number) => void
  publishingChapterId?: number | null
  formatPublishedDate: (date: string | null) => string | null
  isDraft?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}

/**
 * Virtualized chapter list for optimal performance with 1000+ chapters
 * Only renders visible items + buffer
 */
export function VirtualizedChapterList({
  chapters,
  onEdit,
  onDelete,
  onPublish,
  onDragStart,
  onDragOver,
  onDrop,
  publishingChapterId,
  formatPublishedDate,
  isDraft = false,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: VirtualizedChapterListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })
  const ITEM_HEIGHT = 88 // Approximate height of each chapter item
  const BUFFER_SIZE = 5 // Render 5 extra items above and below

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const containerHeight = container.clientHeight
      
      const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE)
      const end = Math.min(
        chapters.length,
        Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_SIZE
      )
      
      setVisibleRange({ start, end })

      // Trigger load more when near bottom
      if (onLoadMore && hasMore && !isLoadingMore) {
        const scrollPercentage = (scrollTop + containerHeight) / container.scrollHeight
        if (scrollPercentage > 0.8) {
          onLoadMore()
        }
      }
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll() // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll)
  }, [chapters.length, onLoadMore, hasMore, isLoadingMore])

  const visibleChapters = chapters.slice(visibleRange.start, visibleRange.end)
  const offsetTop = visibleRange.start * ITEM_HEIGHT
  const totalHeight = chapters.length * ITEM_HEIGHT

  return (
    <div
      ref={containerRef}
      className="space-y-2 overflow-y-auto max-h-[600px]"
      style={{ position: 'relative' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetTop}px)` }}>
          {visibleChapters.map((chapter, index) => {
            const actualIndex = visibleRange.start + index
            const publishedDate = formatPublishedDate(chapter.publishedAt)
            
            return (
              <div
                key={chapter.id}
                className="flex items-center gap-4 rounded-lg border bg-background/60 p-4 transition-colors hover:bg-secondary mb-2"
                draggable={!!onDragStart}
                onDragStart={() => onDragStart?.(chapter.id)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop?.(e, chapter.id)}
              >
                {onDragStart && (
                  <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}

                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onEdit(chapter.id)}
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      Chapter {chapter.order}: {chapter.title}
                    </h4>
                    {!isDraft && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {chapter.wordCount} words • {publishedDate ? `${isDraft ? 'Last published' : 'Published'} ${publishedDate}` : isDraft ? "Draft" : "Published"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(chapter.id)
                    }}
                  >
                    Edit
                  </Button>
                  
                  {isDraft && onPublish && (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      disabled={publishingChapterId === chapter.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onPublish(chapter.id)
                      }}
                    >
                      {publishingChapterId === chapter.id ? "Publishing…" : "Publish"}
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEdit(chapter.id)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Chapter
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(chapter.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Chapter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
          
          {isLoadingMore && (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              Loading more chapters...
            </div>
          )}
          
          {!isLoadingMore && hasMore && onLoadMore && (
            <div className="flex items-center justify-center p-4">
              <Button variant="outline" onClick={onLoadMore}>
                Load More Chapters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
