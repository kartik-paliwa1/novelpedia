"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Badge } from "@/modules/dashboard/components/ui/badge"
import { Button } from "@/modules/dashboard/components/ui/button"
import { Card, CardContent } from "@/modules/dashboard/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/dashboard/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/dashboard/components/ui/dropdown-menu"
import { Input } from "@/modules/dashboard/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/dashboard/components/ui/tabs"
import { StatusBadge } from "@/modules/dashboard/components/ui/status-badge"
import { IconText } from "@/modules/dashboard/components/ui/icon-text"
import { Project, Chapter } from "@/types/editor"
const CHAPTERS_PER_PAGE = 10

import { api } from "@/services/api"

interface NovelWorkspaceProps {
  selectedNovel: Project
  previewMode: "editor" | "reader"
  setPreviewMode: (mode: "editor" | "reader") => void
  setSelectedChapter: (id: number) => void
  onBack: () => void
  onMarkAsCompleted: () => void
  onUpdateNovel: (novel: Project) => void
  chapters?: Chapter[]
  setChapters?: (chapters: Chapter[]) => void
}

export function NovelWorkspace({
  selectedNovel,
  previewMode,
  setPreviewMode,
  setSelectedChapter,
  onBack,
  onMarkAsCompleted,
  onUpdateNovel,
  chapters: externalChapters,
  setChapters: setExternalChapters,
}: NovelWorkspaceProps) {
  const router = useRouter()
  const [internalChapters, setInternalChapters] = useState<Chapter[]>([])
  const chapters = externalChapters ?? internalChapters
  const updateChapters = setExternalChapters ?? setInternalChapters
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [draggedChapter, setDraggedChapter] = useState<number | null>(null)
  const [dragOverChapter, setDragOverChapter] = useState<number | null>(null)
  const [previewChapters, setPreviewChapters] = useState<Chapter[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.getChapters(selectedNovel.slug)
        updateChapters((response.data as Chapter[]) ?? [])
      } catch (err) {
        setError("Failed to fetch chapters.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchChapters()
  }, [selectedNovel.slug, updateChapters])

  // Refetch chapters when component gains focus (e.g., returning from chapter editor)
  // BUT only if we're coming back from another window/tab, not just clicking within the page
  useEffect(() => {
    let lastFocusTime = Date.now()
    
    const refetchChapters = async () => {
      try {
        const response = await api.getChapters(selectedNovel.slug)
        updateChapters((response.data as Chapter[]) ?? [])
      } catch (err) {
        console.error("Failed to refetch chapters:", err)
      }
    }

    const handleFocus = () => {
      const now = Date.now()
      // Only refetch if it's been more than 5 seconds since last focus
      // AND we're not currently saving changes
      // This prevents refetching during drag and drop operations and gives time for updates to persist
      if (now - lastFocusTime > 5000 && !isSaving) {
        refetchChapters()
      }
      lastFocusTime = now
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [selectedNovel.slug, updateChapters])

  const allChaptersPublished = chapters.every((chapter) => chapter.status === "published")
  
  // Use preview chapters during drag, otherwise use normal chapters
  const displayChapters = isDragging && previewChapters.length > 0 ? previewChapters : chapters
  
  const filteredChapters = displayChapters.filter((chapter) => chapter.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.ceil(filteredChapters.length / CHAPTERS_PER_PAGE)
  const startIndex = (currentPage - 1) * CHAPTERS_PER_PAGE
  const paginatedChapters = filteredChapters.slice(startIndex, startIndex + CHAPTERS_PER_PAGE)

  // Auto-adjust pagination when chapters change
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    } else if (filteredChapters.length === 0 && currentPage > 1) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage, filteredChapters.length])

  const handleDeleteChapter = async (chapterId: number) => {
    try {
      await api.deleteChapter(chapterId)
      
      // After deletion, fetch ALL chapters from the backend to ensure we have the complete list
      // This ensures both draft and published chapters are included
      const response = await api.getChapters(selectedNovel.slug)
      const allChaptersFromBackend = (response.data as Chapter[]) ?? []
      
      // Renumber ALL remaining chapters sequentially (both draft and published)
      const updatedChapters = allChaptersFromBackend
        .sort((a, b) => a.order - b.order) // Sort by current order first
        .map((chapter, index) => ({
          ...chapter,
          order: index + 1,
        }))
      
      // Update chapter numbers in the backend for ALL chapters
      let successCount = 0
      let errorCount = 0
      for (const chapter of updatedChapters) {
        try {
          await api.updateChapter(chapter.id, { order: chapter.order })
          successCount++
        } catch (updateErr: any) {
          console.error(`🔧 UPDATE: ❌ Failed to update chapter ${chapter.id}:`, {
            error: updateErr,
            status: updateErr?.status,
            message: updateErr?.message,
            details: updateErr?.details
          })
          errorCount++
        }
      }
      
      updateChapters(updatedChapters)
      
      if (errorCount > 0) {
        setError(`Chapter deleted but ${errorCount} chapter(s) failed to renumber. Please refresh the page.`)
      }
    } catch (err: any) {
      console.error('🔧 DELETE: ❌ Failed to delete chapter:', {
        error: err,
        status: err?.status,
        message: err?.message,
        details: err?.details
      })
      setError("Failed to delete chapter: " + (err?.message || 'Unknown error'))
    } finally {
      setShowDeleteDialog(null)
    }
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

    // Work with ALL chapters (not just filtered/paginated)
    const draggedIndex = chapters.findIndex((c) => c.id === draggedChapter)
    const targetIndex = chapters.findIndex((c) => c.id === targetChapterId)

    const newChapters = [...chapters]
    const [draggedItem] = newChapters.splice(draggedIndex, 1)
    newChapters.splice(targetIndex, 0, draggedItem)

    // Renumber ALL chapters based on new order
    const updatedChapters = newChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }))

    // Update UI immediately for smooth experience
    updateChapters(updatedChapters)
    setDraggedChapter(null)
    setPreviewChapters([])
    
    // Persist reordering to backend for ALL chapters with proper sequencing
    setIsSaving(true)
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
        setError(`Failed to reorder ${failures.length} chapter(s). Refreshing...`)
        // Refetch from backend to ensure consistency
        const response = await api.getChapters(selectedNovel.slug)
        updateChapters((response.data as Chapter[]) ?? [])
      }
    } catch (err) {
      setError('Failed to reorder chapters. Refreshing...')
      // Refetch from backend on error to ensure consistency
      try {
        const response = await api.getChapters(selectedNovel.slug)
        updateChapters((response.data as Chapter[]) ?? [])
      } catch (refetchErr) {
        setError('Failed to refresh chapters. Please reload the page.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleMarkAsCompleted = () => {
    onMarkAsCompleted()
    setShowCompletionDialog(false)
  }

  const handleAddChapter = async () => {
    try {
      const nextChapterNumber = chapters.length + 1;
      const response = await api.createChapter(selectedNovel.slug, {
        title: `Chapter ${nextChapterNumber}`,
        order: nextChapterNumber, // Explicitly set the chapter number
      });
      const newChapter = response.data as Chapter | undefined
      if (newChapter) {
        updateChapters([...chapters, newChapter]);
        setSelectedChapter(newChapter.id);
      }
    } catch (err) {
      setError("Failed to create chapter.");
    }
  };

  // Calculate total word count - memoized to ensure consistency across tabs
  const totalWordCount = chapters.reduce((acc, c) => acc + (c.wordCount ?? 0), 0);

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
          <Button
            variant="outline"
            onClick={() => {
              const target = selectedNovel.slug || String(selectedNovel.id)
              const encodedTarget = encodeURIComponent(target)
              router.push(`/novel/${encodedTarget}/edit`)
            }}
            className="gap-2 bg-transparent"
          >
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
              <div className="w-full max-w-[600px] mx-auto rounded-lg overflow-hidden mb-4">
                <div
                  className="w-full h-[800px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedNovel.cover || `https://placehold.co/600x800/1a1a1a/ffffff?text=${encodeURIComponent(selectedNovel.title || 'Novel')}`})` }}
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
                        <div className="text-2xl font-bold">
                          {totalWordCount.toLocaleString()}
                        </div>
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
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold">Chapters ({chapters.length})</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{chapters.filter(c => c.status === 'published').length} published</span>
                          <span>{chapters.filter(c => c.status === 'draft').length} drafts</span>
                          <span>
                            {totalWordCount.toLocaleString()} total words
                          </span>
                        </div>
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
                        {/* Only show New Chapter button in Editor mode */}
                        {previewMode === "editor" && (
                          <Button 
                            size="sm" 
                            className="gap-2 bg-blue-600 hover:bg-blue-700"
                            onClick={handleAddChapter}
                          >
                            <Plus className="h-4 w-4" />
                            New Chapter
                          </Button>
                        )}
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
                            {/* Drag Handle - Only show in Editor mode */}
                            {previewMode === "editor" && (
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
                            )}

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

                          {/* Chapter Actions - Only show in Editor mode */}
                          {previewMode === "editor" && (
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
                          )}
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

    </div>
  )
}
