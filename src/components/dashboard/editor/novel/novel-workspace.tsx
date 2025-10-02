"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
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
import { Badge } from "@/components/dashboard/ui/badge"
import { Button } from "@/components/dashboard/ui/button"
import { Card, CardContent } from "@/components/dashboard/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu"
import { Input } from "@/components/dashboard/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs"
import { StatusBadge } from "@/components/dashboard/ui/status-badge"
import { IconText } from "@/components/dashboard/ui/icon-text"
import { Pagination } from "@/components/dashboard/ui/pagination"
import { Project, Chapter } from "@/types/editor"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/dashboard/ui/toast"
import { formatDate } from "@/utils/date-formatter"
interface NovelWorkspaceProps {
  selectedNovel: Project
  chapters: Chapter[]
  setChapters: (chapters: Chapter[]) => void
  previewMode: "editor" | "reader"
  setPreviewMode: (mode: "editor" | "reader") => void
  setSelectedChapter: (id: number) => void
  onBack: () => void
  onMarkAsCompleted: () => void
  onUpdateNovel: (novel: Project) => void
}

export function NovelWorkspace({
  selectedNovel,
  chapters,
  setChapters,
  previewMode,
  setPreviewMode,
  setSelectedChapter,
  onBack,
  onMarkAsCompleted,
  onUpdateNovel,
}: NovelWorkspaceProps) {
  const router = useRouter()
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedChapter, setDraggedChapter] = useState<number | null>(null)
  const [dragOverChapter, setDragOverChapter] = useState<number | null>(null)
  const [previewChapters, setPreviewChapters] = useState<Chapter[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isCreatingChapter, setIsCreatingChapter] = useState(false)
  const [isDeletingChapter, setIsDeletingChapter] = useState(false)
  const [publishingChapterId, setPublishingChapterId] = useState<number | null>(null)
  const [draftPage, setDraftPage] = useState(1)
  const [publishedPage, setPublishedPage] = useState(1)
  const [chapterViewMode, setChapterViewMode] = useState<"draft" | "published">("draft")
  const { toast, toasts, removeToast } = useToast()

  const allChaptersPublished = chapters.length > 0 && chapters.every((chapter) => chapter.status === "published")
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order)
  const filteredChapters = sortedChapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const draftChapters = filteredChapters.filter((chapter) => chapter.status === "draft")
  const publishedChapters = filteredChapters.filter((chapter) => chapter.status === "published")

  const handleDeleteChapter = async (chapterId: number) => {
    try {
      await api.deleteChapter(chapterId)
      const filteredChapters = chapters.filter((chapter) => chapter.id !== chapterId)
      // Renumber remaining chapters sequentially
      const updatedChapters = filteredChapters.map((chapter, index) => ({
        ...chapter,
        order: index + 1,
      }))
      
      // Update chapter numbers in the backend
      await Promise.all(
        updatedChapters.map((chapter) =>
          api.updateChapter(chapter.id, { order: chapter.order })
        )
      )
      
      setChapters(updatedChapters)
      
      toast({
        title: "Chapter deleted",
        description: "Chapter has been deleted and remaining chapters have been renumbered.",
        variant: "success",
      })
    } catch (err: any) {
      console.error('Failed to delete chapter:', err)
      toast({
        title: "Delete failed",
        description: err?.message || "Failed to delete chapter. Please try again.",
        variant: "error",
      })
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

    const draggedIndex = chapters.findIndex((c) => c.id === draggedChapter)
    const targetIndex = chapters.findIndex((c) => c.id === targetChapterId)

    const newChapters = [...chapters]
    const [draggedItem] = newChapters.splice(draggedIndex, 1)
    newChapters.splice(targetIndex, 0, draggedItem)

    // Renumber ALL chapters based on new order
    const updatedChapters: Chapter[] = newChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }))

    // Update UI immediately for smooth experience
    setChapters(updatedChapters)
    setDraggedChapter(null)
    setPreviewChapters([])
    
    // Persist reordering to backend for ALL chapters
    try {
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
        toast({
          title: "Partial save",
          description: `Failed to reorder ${failures.length} chapter(s). Refreshing...`,
          variant: "error",
        })
        // Refetch from backend to ensure consistency
        const response = await api.getChapters(selectedNovel.slug)
        setChapters((response.data as Chapter[]) ?? [])
      } else {
        toast({
          title: "Chapters reordered",
          description: "All chapters have been reordered successfully.",
          variant: "success",
        })
      }
    } catch (err) {
      toast({
        title: "Reorder failed",
        description: "Failed to save chapter order. Refreshing...",
        variant: "error",
      })
      // Refetch from backend on error
      try {
        const response = await api.getChapters(selectedNovel.slug)
        setChapters((response.data as Chapter[]) ?? [])
      } catch (refetchErr) {
        // Silent fail - already showed error toast
      }
    }
  }

  const handleMarkAsCompleted = () => {
    onMarkAsCompleted()
    setShowCompletionDialog(false)
  }

  const handlePublishChapter = async (chapterId: number) => {
    setPublishingChapterId(chapterId)
    try {
  const response = await api.updateChapter(chapterId, { status: "published" })
  const updatedChapter = response.data as Chapter

      const updatedChapters: Chapter[] = chapters.map((chapter) =>
        chapter.id === chapterId
          ? (updatedChapter ?? { ...chapter, status: "published" as const })
          : chapter
      )

      setChapters(updatedChapters)

      toast({
        title: "Chapter published",
        description: "Readers can now see this chapter.",
        variant: "success",
      })
    } catch (error: any) {
      console.error('Failed to publish chapter:', error)
      toast({
        title: "Publish failed",
        description: (error?.message as string) || "We couldn't publish this chapter. Please try again.",
        variant: "error",
      })
    } finally {
      setPublishingChapterId(null)
    }
  }

  const handleAddChapter = async () => {
    setIsCreatingChapter(true)
    try {
      const chapterData = {
        title: `Chapter ${chapters.length + 1}`,
        is_published: false
      }
      
      const response = await api.createChapter(selectedNovel.slug, chapterData)
      const newChapter = response.data
      
      const updatedChapters = [...chapters, newChapter]
      setChapters(updatedChapters)
      
      toast({
        title: "Chapter created",
        description: `${newChapter.title} has been created successfully.`,
        variant: "success"
      })
      
      // Automatically navigate to the new chapter for editing
      setSelectedChapter(newChapter.id)
    } catch (error) {
      console.error('Failed to create chapter:', error)
      toast({
        title: "Failed to create chapter",
        description: "There was an error creating the new chapter. Please try again.",
        variant: "error"
      })
    } finally {
      setIsCreatingChapter(false)
    }
  }

  const formatPublishedDate = (value: string | null) => {
    if (!value) {
      return null
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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

      {/* Chapter View Mode Toggle */}
      <div className="flex items-center gap-2 p-4 bg-card rounded-lg border">
        <span className="text-sm font-medium">View Chapters:</span>
        <div className="flex items-center gap-1">
          <Button
            variant={chapterViewMode === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setChapterViewMode("draft")
              setDraftPage(1)
            }}
          >
            Draft Chapters
          </Button>
          <Button
            variant={chapterViewMode === "published" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setChapterViewMode("published")
              setPublishedPage(1)
            }}
          >
            Published Chapters
          </Button>
        </div>
        <span className="text-xs text-muted-foreground ml-2">
          {chapterViewMode === "draft" 
            ? `${draftChapters.length} draft chapter${draftChapters.length !== 1 ? 's' : ''}`
            : `${publishedChapters.length} published chapter${publishedChapters.length !== 1 ? 's' : ''}`}
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
                  style={{ backgroundImage: `url(${selectedNovel.cover})` }}
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
                  <IconText icon={Eye}>{selectedNovel.views.toLocaleString()}</IconText>
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
                        <div className="text-2xl font-bold">{totalWordCount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Words</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedNovel.views.toLocaleString()}</div>
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
                          <span>{totalWordCount.toLocaleString()} total words</span>
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
                        {/* New Chapter button */}
                        <Button 
                          size="sm" 
                          className="gap-2 bg-blue-600 hover:bg-blue-700"
                          onClick={handleAddChapter}
                          disabled={isCreatingChapter}
                        >
                          <Plus className="h-4 w-4" />
                          {isCreatingChapter ? 'Creating...' : 'New Chapter'}
                        </Button>
                      </div>
                    </div>

                    {/* Chapters List with Pagination */}
                    <div className="space-y-6">
                      {chapterViewMode === "draft" ? (
                        <section>
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                              Drafts ({draftChapters.length})
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {draftChapters.length === 0 ? (
                              <div className="rounded-lg border border-dashed px-6 py-8 text-center text-sm text-muted-foreground">
                                No draft chapters yet. Create a new chapter to start writing.
                              </div>
                            ) : (
                              <>
                                {draftChapters
                                  .slice((draftPage - 1) * 10, draftPage * 10)
                                  .map((chapter) => {
                                    const publishedDate = formatPublishedDate(chapter.publishedAt)
                                    return (
                                      <div
                                        key={chapter.id}
                                        className="flex items-center gap-4 rounded-lg border bg-background/60 p-4 transition-colors hover:bg-secondary"
                                        draggable={true}
                                        onDragStart={() => handleDragStart(chapter.id)}
                                        onDragOver={(e) => handleDragOver(e, chapter.id)}
                                        onDrop={(e) => handleDrop(e, chapter.id)}
                                        onDragEnd={handleDragEnd}
                                      >
                                        <div className="cursor-grab active:cursor-grabbing">
                                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        </div>

                                        <div
                                          className="flex-1 cursor-pointer"
                                          onClick={() => setSelectedChapter(chapter.id)}
                                        >
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-medium">
                                              Chapter {chapter.order}: {chapter.title}
                                            </h4>
                                          </div>
                                          <p className="text-sm text-muted-foreground">
                                            {chapter.wordCount} words • {publishedDate ? `Last published ${publishedDate}` : "Draft"}
                                          </p>
                                        </div>

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
                                          <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                            disabled={publishingChapterId === chapter.id}
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              void handlePublishChapter(chapter.id)
                                            }}
                                          >
                                            {publishingChapterId === chapter.id ? "Publishing…" : "Publish"}
                                          </Button>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                              <DropdownMenuItem onClick={() => setSelectedChapter(chapter.id)}>
                                                <Edit3 className="mr-2 h-4 w-4" />
                                                Edit Chapter
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                onClick={() => setShowDeleteDialog(chapter.id)}
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
                                </>
                              )}
                            </div>
                            {draftChapters.length > 10 && (
                              <div className="mt-4 flex justify-center">
                                <Pagination
                                  currentPage={draftPage}
                                  totalPages={Math.ceil(draftChapters.length / 10)}
                                  onPageChange={setDraftPage}
                                />
                              </div>
                            )}
                          </section>
                        ) : (
                          <section>
                            <div className="mb-3 flex items-center justify-between">
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Published ({publishedChapters.length})
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {publishedChapters.length === 0 ? (
                                <div className="rounded-lg border border-dashed px-6 py-8 text-center text-sm text-muted-foreground">
                                  Published chapters will appear here once you publish them.
                                </div>
                              ) : (
                                <>
                                  {publishedChapters
                                    .slice((publishedPage - 1) * 10, publishedPage * 10)
                                    .map((chapter) => {
                                      const publishedDate = formatPublishedDate(chapter.publishedAt)
                                      return (
                                        <div
                                          key={chapter.id}
                                          className="flex items-center gap-4 rounded-lg border bg-background/60 p-4 transition-colors hover:bg-secondary"
                                          draggable={true}
                                          onDragStart={() => handleDragStart(chapter.id)}
                                          onDragOver={(e) => handleDragOver(e, chapter.id)}
                                          onDrop={(e) => handleDrop(e, chapter.id)}
                                          onDragEnd={handleDragEnd}
                                        >
                                          <div className="cursor-grab active:cursor-grabbing">
                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                          </div>

                                          <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => setSelectedChapter(chapter.id)}
                                          >
                                            <div className="flex items-center gap-2">
                                              <h4 className="font-medium">
                                                Chapter {chapter.order}: {chapter.title}
                                              </h4>
                                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                              {chapter.wordCount} words • {publishedDate ? `Published ${publishedDate}` : "Published"}
                                            </p>
                                          </div>

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
                                                  <Edit3 className="mr-2 h-4 w-4" />
                                                  Edit Chapter
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  onClick={() => setShowDeleteDialog(chapter.id)}
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
                                </>
                              )}
                            </div>
                            {publishedChapters.length > 10 && (
                              <div className="mt-4 flex justify-center">
                                <Pagination
                                  currentPage={publishedPage}
                                  totalPages={Math.ceil(publishedChapters.length / 10)}
                                  onPageChange={setPublishedPage}
                                />
                              </div>
                            )}
                          </section>
                        )}
                    </div>
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
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)} disabled={isDeletingChapter}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => showDeleteDialog && handleDeleteChapter(showDeleteDialog)}
              disabled={isDeletingChapter}
            >
              {isDeletingChapter ? 'Deleting...' : 'Delete Chapter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}
