"use client"

import { Button } from '@/common/components/ui/button'
import { Card, CardContent } from '@/common/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu'
import { Calendar, Edit3, Eye, MoreHorizontal, Plus, GripVertical, AlertCircle } from "lucide-react"
import { StatusBadge } from '@/common/components/ui/status-badge'
import { useState, useCallback, useRef } from 'react'
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

interface ChapterManagerFixedProps {
  novelId?: string
  initialChapters?: Chapter[]
}

export function ChapterManagerFixed({ novelId, initialChapters }: ChapterManagerFixedProps) {
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
  const [error, setError] = useState<string | null>(null)
  
  // Use ref to track the original order for rollback
  const originalOrderRef = useRef<Chapter[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Sort chapters by order for display
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order)

  const reorderChapters = useCallback(async (chapterOrders: { id: string, order: number }[]) => {
    if (!novelId) {
      console.log('No novelId provided, skipping API call')
      return
    }

    setIsReordering(true)
    setError(null)
    
    try {
      console.log('Sending reorder request:', { novelId, chapterOrders })
      
      const response = await fetch('/api/chapters/test-reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          novelId,
          chapterOrders,
        }),
      })

      const responseData = await response.text()
      console.log('Reorder response:', response.status, responseData)

      if (!response.ok) {
        throw new Error(`Failed to reorder chapters: ${response.status} ${responseData}`)
      }
      
      console.log('Reorder successful')
    } catch (err) {
      console.error('Error reordering chapters:', err)
      
      // Rollback to original order
      setChapters(originalOrderRef.current)
      setError(err instanceof Error ? err.message : 'Failed to reorder chapters')
    } finally {
      setIsReordering(false)
    }
  }, [novelId])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      console.log('Drag ended:', active.id, 'over', over.id)
      
      // Store original order for potential rollback
      originalOrderRef.current = [...chapters]
      
      const oldIndex = sortedChapters.findIndex((chapter) => chapter.id === active.id)
      const newIndex = sortedChapters.findIndex((chapter) => chapter.id === over.id)

      console.log('Moving from index', oldIndex, 'to', newIndex)

      const newChapters = arrayMove(sortedChapters, oldIndex, newIndex)
      
      // Update order values and state
      const updatedChapters = newChapters.map((chapter, index) => ({
        ...chapter,
        order: index,
      }))
      
      console.log('New order:', updatedChapters.map(c => ({ id: c.id, order: c.order })))
      
      setChapters(updatedChapters)

      // Save to backend immediately
      const chapterOrders = updatedChapters.map((chapter) => ({
        id: chapter.id,
        order: chapter.order,
      }))
      
      reorderChapters(chapterOrders)
    }
  }, [sortedChapters, chapters, reorderChapters])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chapters</h3>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Chapter
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

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
      
      <div className="mt-4 text-xs text-muted-foreground">
        Debug: Novel ID = {novelId || 'Not provided'}
      </div>
    </div>
  )
}