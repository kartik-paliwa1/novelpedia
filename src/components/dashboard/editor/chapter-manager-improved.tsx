"use client"

import { Button } from '@/common/components/ui/button'
import { Card, CardContent } from '@/common/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu'
import { Calendar, Edit3, Eye, MoreHorizontal, Plus, GripVertical, AlertCircle } from "lucide-react"
import { StatusBadge } from '@/common/components/ui/status-badge'
import { useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useChapters } from '@/hooks/useChapters'

interface Chapter {
  id: string
  title: string
  content: string
  wordCount: number
  order: number
  status: 'DRAFT' | 'PUBLISHED'
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

interface ChapterItemProps {
  chapter: Chapter
  chapterNumber: number
  onEdit?: (chapter: Chapter) => void
  onDelete?: (chapter: Chapter) => void
}

function SortableChapterItem({ chapter, chapterNumber, onEdit, onDelete }: ChapterItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`neumorphic ${isDragging ? 'shadow-lg z-10' : ''} transition-shadow`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">
                  Chapter {chapterNumber}: {chapter.title}
                </h4>
                <StatusBadge 
                  status={chapter.status === "PUBLISHED" ? "Completed" : "Draft"}
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{chapter.wordCount} words</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {formatDate(chapter.updatedAt)}</span>
                </div>
                {chapter.status === 'PUBLISHED' && chapter.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>Published {formatDate(chapter.publishedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(chapter)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit?.(chapter)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>Preview</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onDelete?.(chapter)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ChapterManagerImprovedProps {
  novelId?: string
  initialChapters?: Chapter[]
  onEditChapter?: (chapter: Chapter) => void
  onCreateChapter?: () => void
}

export function ChapterManagerImproved({ 
  novelId, 
  initialChapters,
  onEditChapter,
  onCreateChapter
}: ChapterManagerImprovedProps) {
  const {
    chapters,
    isLoading,
    isReordering,
    error,
    reorderChapters,
    deleteChapter,
  } = useChapters({ novelId, initialChapters })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = chapters.findIndex((chapter) => chapter.id === active.id)
      const newIndex = chapters.findIndex((chapter) => chapter.id === over.id)

      const newOrder = arrayMove(chapters, oldIndex, newIndex)
      reorderChapters(newOrder)
    }
  }, [chapters, reorderChapters])

  const handleDeleteChapter = useCallback(async (chapter: Chapter) => {
    if (window.confirm(`Are you sure you want to delete "${chapter.title}"? This action cannot be undone.`)) {
      await deleteChapter(chapter.id)
    }
  }, [deleteChapter])

  if (isLoading && chapters.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Chapters</h3>
          <Button size="sm" className="gap-2" disabled>
            <Plus className="h-4 w-4" />
            New Chapter
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Loading chapters...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chapters</h3>
        <Button 
          size="sm" 
          className="gap-2"
          onClick={onCreateChapter}
          disabled={isReordering}
        >
          <Plus className="h-4 w-4" />
          New Chapter
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {isReordering && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Saving new order...
        </div>
      )}

      {chapters.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No chapters yet</p>
              <p className="text-sm">Create your first chapter to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={chapters.map(c => c.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <SortableChapterItem 
                  key={chapter.id} 
                  chapter={chapter} 
                  chapterNumber={index + 1}
                  onEdit={onEditChapter}
                  onDelete={handleDeleteChapter}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}