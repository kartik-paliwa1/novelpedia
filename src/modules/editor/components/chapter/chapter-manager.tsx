"use client"

import { Button } from '@/common/components/ui/button'
import { Card, CardContent } from '@/common/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu'
import { Calendar, Edit3, Eye, MoreHorizontal, Plus, GripVertical } from "lucide-react"
import { StatusBadge } from '@/common/components/ui/status-badge'
import { useState, useCallback, useMemo } from 'react'
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

interface Chapter {
  id: string
  title: string
  wordCount: number
  status: "Published" | "Draft"
  lastEdited: string
  views: number
  order: number
}

interface ChapterItemProps {
  chapter: Chapter
  chapterNumber: number
}

function SortableChapterItem({ chapter, chapterNumber }: ChapterItemProps) {
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

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`neumorphic ${isDragging ? 'shadow-lg z-10' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">
                  Chapter {chapterNumber}: {chapter.title}
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
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ChapterManagerProps {
  novelId?: string
  initialChapters?: Chapter[]
}

export function ChapterManager({ novelId, initialChapters }: ChapterManagerProps) {
  const [chapters, setChapters] = useState<Chapter[]>(
    initialChapters || [
      {
        id: '1',
        title: "The Beginning",
        wordCount: 2500,
        status: "Published",
        lastEdited: "2 days ago",
        views: 1200,
        order: 0,
      },
      {
        id: '2',
        title: "First Steps",
        wordCount: 3200,
        status: "Published",
        lastEdited: "1 week ago",
        views: 980,
        order: 1,
      },
      {
        id: '3',
        title: "The Discovery",
        wordCount: 2800,
        status: "Draft",
        lastEdited: "3 hours ago",
        views: 0,
        order: 2,
      },
    ]
  )

  const [isReordering, setIsReordering] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Sort chapters by order for display
  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => a.order - b.order)
  }, [chapters])

  const reorderChapters = useCallback(async (chapterOrders: { id: string, order: number }[]) => {
    if (!novelId) return

    setIsReordering(true)
    try {
      const { default: chapterService } = await import('@/services/chapter.service')
      await chapterService.reorderChapters(novelId, chapterOrders)
    } catch (error) {
      console.error('Error reordering chapters:', error)
      // Could add toast notification here
    } finally {
      setIsReordering(false)
    }
  }, [novelId])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sortedChapters.findIndex((chapter) => chapter.id === active.id)
      const newIndex = sortedChapters.findIndex((chapter) => chapter.id === over.id)

      const newChapters = arrayMove(sortedChapters, oldIndex, newIndex)
      
      // Update order values and state
      const updatedChapters = newChapters.map((chapter, index) => ({
        ...chapter,
        order: index,
      }))
      
      setChapters(updatedChapters)

      // Save to backend immediately
      const chapterOrders = updatedChapters.map((chapter) => ({
        id: chapter.id,
        order: chapter.order,
      }))
      
      reorderChapters(chapterOrders)
    }
  }, [sortedChapters, reorderChapters])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chapters</h3>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Chapter
        </Button>
      </div>

      {isReordering && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Saving new order...
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sortedChapters.map(c => c.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sortedChapters.map((chapter, index) => (
              <SortableChapterItem 
                key={chapter.id} 
                chapter={chapter} 
                chapterNumber={index + 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
