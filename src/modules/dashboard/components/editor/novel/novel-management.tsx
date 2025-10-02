"use client"

import { useState } from "react"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  GripVertical,
  Heart,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
} from "lucide-react"
import { Badge } from "@/common/components/ui/badge"
import { Button } from "@/common/components/ui/button"
import { Card, CardContent } from "@/common/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu"
import { Input } from "@/common/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs"
import { EditNovelDialog } from "@/modules/dashboard/components/editor/dialogs/edit-novel-dialog"
import { ChapterReader } from "@/modules/dashboard/components/editor/chapter/chapter-reader"
import { StatusBadge } from "@/common/components/ui/status-badge"
import { IconText } from "@/common/components/ui/icon-text"
import { Project, Chapter } from "@/types/editor"
import { CHAPTERS_PER_PAGE } from "@/data/editor-mock-data"
import { api } from "@/services/api"

interface NovelManagementProps {
  selectedNovel: Project
  chapters: Chapter[]
  setChapters: (chapters: Chapter[]) => void
  previewMode: "editor" | "reader"
  setPreviewMode: (mode: "editor" | "reader") => void
  selectedChapter: number | null
  setSelectedChapter: (id: number | null) => void
  onBack: () => void
  onMarkAsCompleted: () => void
  onUpdateNovel: (novel: Project) => void
}

export function NovelManagement({
  selectedNovel,
  chapters,
  setChapters,
  previewMode,
  setPreviewMode,
  selectedChapter,
  setSelectedChapter,
  onBack,
  onMarkAsCompleted,
  onUpdateNovel,
}: NovelManagementProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [draggedChapter, setDraggedChapter] = useState<number | null>(null)
  const [dragOverChapter, setDragOverChapter] = useState<number | null>(null)
  const [previewChapters, setPreviewChapters] = useState<Chapter[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Helper function to format date
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'Not published'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
      return `${Math.ceil(diffDays / 365)} years ago`
    } catch {
      return 'Invalid date'
    }
  }

  const allChaptersPublished = chapters.every((chapter) => chapter.status === "published")
  
  // Use preview chapters during drag, otherwise use normal chapters
  const displayChapters = isDragging && previewChapters.length > 0 ? previewChapters : chapters
  
  const filteredChapters = displayChapters.filter((chapter) => chapter.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.ceil(filteredChapters.length / CHAPTERS_PER_PAGE)
  const startIndex = (currentPage - 1) * CHAPTERS_PER_PAGE
  const paginatedChapters = filteredChapters.slice(startIndex, startIndex + CHAPTERS_PER_PAGE)

  const handleDeleteChapter = (chapterId: number) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId))
    setShowDeleteDialog(null)
  }

  const handleDragStart = (chapterId: number) => {
    setDraggedChapter(chapterId)
    setIsDragging(true)
    setPreviewChapters(chapters)
  }

  const handleDragOver = (e: React.DragEvent, targetChapterId: number) => {
    e.preventDefault()
    
    if (!draggedChapter || draggedChapter === targetChapterId) {
      setDragOverChapter(null)
      return
    }
    
    setDragOverChapter(targetChapterId)
    
    // Calculate and preview the new order
    const draggedIndex = chapters.findIndex((c) => c.id === draggedChapter)
    const targetIndex = chapters.findIndex((c) => c.id === targetChapterId)
    
    const newChapters = [...chapters]
    const [draggedItem] = newChapters.splice(draggedIndex, 1)
    newChapters.splice(targetIndex, 0, draggedItem)
    
    // Update preview with new chapter numbers
    const updatedPreview = newChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }))
    
    setPreviewChapters(updatedPreview)
  }
  
  const handleDragEnd = () => {
    setIsDragging(false)
    setDragOverChapter(null)
  }

  const handleDrop = async (e: React.DragEvent, targetChapterId: number) => {
    e.preventDefault()
    setIsDragging(false)
    setDragOverChapter(null)
    
    if (!draggedChapter || draggedChapter === targetChapterId) {
      setDraggedChapter(null)
      return
    }

    const draggedIndex = chapters.findIndex((c) => c.id === draggedChapter)
    const targetIndex = chapters.findIndex((c) => c.id === targetChapterId)

    const newChapters = [...chapters]
    const [draggedItem] = newChapters.splice(draggedIndex, 1)
    newChapters.splice(targetIndex, 0, draggedItem)

    const updatedChapters = newChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }))

    // Update UI immediately for smooth experience
    setChapters(updatedChapters)
    setDraggedChapter(null)
    setPreviewChapters([])
    
    // Persist reordering to backend for ALL chapters with proper sequencing
    try {
      // Update all chapters in parallel for better performance
      const updatePromises = updatedChapters.map(async (chapter) => {
        try {
          await api.updateChapter(chapter.id, { order: chapter.order })
          return { success: true, chapterId: chapter.id }
        } catch (updateErr: any) {
          return { success: false, chapterId: chapter.id, error: updateErr }
        }
      })
      
      const results = await Promise.all(updatePromises)
      const failures = results.filter(r => !r.success)
      
      if (failures.length > 0) {
        // Refetch from backend to ensure consistency
        const response = await api.getChapters(selectedNovel.slug)
        setChapters((response.data as Chapter[]) ?? [])
      }
    } catch (err) {
      // Refetch from backend on error to ensure consistency
      try {
        const response = await api.getChapters(selectedNovel.slug)
        setChapters((response.data as Chapter[]) ?? [])
      } catch (refetchErr) {
        // Silent fail
      }
    }
  }

  const handleMarkAsCompleted = () => {
    onMarkAsCompleted()
    setShowCompletionDialog(false)
  }

  // If previewing a chapter
  if (selectedChapter) {
    const chapter = chapters.find((c) => c.id === selectedChapter)
    if (chapter) {
      return (
        <ChapterReader
          novel={selectedNovel}
          chapter={chapter}
          onBack={() => setSelectedChapter(null)}
          previewMode={previewMode}
        />
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{selectedNovel.title}</h1>
          <p className="text-muted-foreground">{selectedNovel.genre}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)} className="gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Edit Novel
          </Button>

          {selectedNovel.status === "Draft" && allChaptersPublished && (
            <Button onClick={() => setShowCompletionDialog(true)} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Mark as Completed
            </Button>
          )}
        </div>
      </div>

      {/* Preview Mode Toggle */}
      <div className="flex items-center gap-2 p-4 bg-card rounded-lg border">
        <span className="text-sm font-medium">Preview Mode:</span>
        <div className="flex items-center gap-1">
          <Button
            variant={previewMode === "editor" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("editor")}
          >
            Editor View
          </Button>
          <Button
            variant={previewMode === "reader" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("reader")}
          >
            Reader View
          </Button>
        </div>
        <span className="text-xs text-muted-foreground ml-2">
          {previewMode === "reader" ? "See exactly how readers will view your novel" : "Standard editing view"}
        </span>
      </div>

      {/* Novel Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="neumorphic">
            <CardContent className="p-6">
              <div className="aspect-[3/4] w-full rounded-lg overflow-hidden mb-4">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedNovel.cover || `https://placehold.co/400x600/1a1a1a/ffffff?text=${encodeURIComponent(selectedNovel.title || 'Novel')}`})` }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedNovel.status} />
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">{selectedNovel.rating || "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <IconText icon={BookOpen}>{chapters.length} chapters</IconText>
                  <IconText icon={Eye}>{Number(selectedNovel.views ?? 0).toLocaleString()}</IconText>
                  <IconText icon={Heart}>{selectedNovel.collections}</IconText>
                  <IconText icon={Calendar}>{formatDate(selectedNovel.lastUpdated)}</IconText>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedNovel.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="chapters" className="space-y-4">
            <TabsList className="bg-card">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card className="neumorphic">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedNovel.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{Number(selectedNovel.words ?? 0).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Words</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{Number(selectedNovel.views ?? 0).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedNovel.collections}</div>
                        <div className="text-sm text-muted-foreground">Collections</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chapters">
              <Card className="neumorphic">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Chapter Management Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">Chapters ({chapters.length})</h3>
                        {selectedNovel.status === "Draft" && (
                          <div className="text-xs text-muted-foreground">
                            {allChaptersPublished ? "All chapters published" : "Some chapters still drafts"}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative w-full md:w-80">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search chapters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          New Chapter
                        </Button>
                      </div>
                    </div>

                    {/* Chapters List */}
                    {isDragging && (
                      <div className="mb-2 p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm">
                        🎯 Dragging mode active - Chapter numbers updating in real-time
                      </div>
                    )}
                    <div className="space-y-2">
                      {paginatedChapters.map((chapter) => {
                        const isBeingDragged = draggedChapter === chapter.id
                        const isDragTarget = dragOverChapter === chapter.id
                        
                        // Get the display order from preview if dragging, otherwise use chapter.order
                        const displayOrder = isDragging && previewChapters.length > 0 
                          ? previewChapters.find(c => c.id === chapter.id)?.order ?? chapter.order
                          : chapter.order
                        
                        // Debug logging
                        if (isDragging && chapter.id === draggedChapter) {
                          console.log(`🎯 Dragged chapter ${chapter.id}: original=${chapter.order}, display=${displayOrder}`)
                        }
                        
                        return (
                          <div
                            key={chapter.id}
                            className={`
                              flex items-center gap-4 p-4 rounded-lg border 
                              transition-all duration-200 ease-in-out
                              ${isBeingDragged ? 'opacity-50 scale-95 bg-blue-50 dark:bg-blue-950/30 border-blue-400' : ''}
                              ${isDragTarget ? 'border-blue-500 border-2 shadow-lg scale-[1.02] bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-secondary'}
                              ${isDragging && !isBeingDragged ? 'transition-transform duration-300' : ''}
                            `}
                            onDragOver={(e) => handleDragOver(e, chapter.id)}
                            onDrop={(e) => handleDrop(e, chapter.id)}
                            onDragEnd={handleDragEnd}
                          >
                            {/* Drag Handle */}
                            <div 
                              className={`
                                cursor-grab active:cursor-grabbing
                                transition-transform duration-200
                                ${isBeingDragged ? 'scale-110' : ''}
                              `}
                              draggable={true}
                              onDragStart={(e) => {
                                e.stopPropagation()
                                handleDragStart(chapter.id)
                              }}
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>

                            {/* Chapter Info */}
                            <div className="flex-1 cursor-pointer" onClick={() => !isDragging && setSelectedChapter(chapter.id)}>
                              <div className="flex items-center gap-2">
                                <h4 className={`
                                  font-medium transition-all duration-200
                                  ${isDragging && !isBeingDragged ? 'transform' : ''}
                                `}>
                                  <span className={`
                                    inline-block transition-all duration-300
                                    ${isDragging ? 'font-bold text-blue-600 dark:text-blue-400' : ''}
                                  `}>
                                    Chapter {displayOrder}:
                                  </span> {chapter.title}
                                </h4>
                                {chapter.status === "published" && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {chapter.wordCount} words • {chapter.status === "published" ? `Published ${formatDate(chapter.publishedAt)}` : 'Draft'}
                              </p>
                            </div>

                          {/* Chapter Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedChapter(chapter.id)
                              }}
                            >
                              Edit
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setSelectedChapter(chapter.id)}>
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit Chapter
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setShowDeleteDialog(chapter.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Chapter
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Showing {startIndex + 1}-{Math.min(startIndex + CHAPTERS_PER_PAGE, filteredChapters.length)}{" "}
                          of {filteredChapters.length} chapters
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Novel as Completed</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark &quot;{selectedNovel.title}&quot; as completed? This will enable reader preview
              mode.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompletionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkAsCompleted}>Mark as Completed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <EditNovelDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        novel={selectedNovel}
        onSave={(updatedNovel) => {
          onUpdateNovel({ ...selectedNovel, ...updatedNovel })
          setIsEditDialogOpen(false)
        }}
      />
    </div>
  )
}
