"use client"

import { useState, useEffect } from "react"
import { Grid3X3, List, Plus, Search } from "lucide-react"
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { CreateNovelDialog } from '@/modules/editor/components/dialogs/create-novel-dialog'
import { UnifiedNovelCard } from '@/modules/novel/components/unified-novel-card'
import { NovelManagement } from '@/modules/editor/components/novel/novel-management'
import { StatsOverview } from '@/modules/editor/components/stats/stats-overview'
import { WritingStats } from '@/modules/editor/components/stats/writing-stats'
import { Project } from '@/types/editor'
// Removed mock data usage – load real data from API
import { api } from '@/services/api'
import { generateSlug, ensureUniqueSlug } from '@/utils/slug-utils'
import { ensureArray } from '@/utils/safe-array'

export function EditorContent() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState<"editor" | "reader">("editor")
  const [chapters, setChapters] = useState([] as any[])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchNovelsQuery, setSearchNovelsQuery] = useState("")

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setIsLoading(true);
        const novelsResponse = await api.getNovels();
        const novels = ensureArray<Project>(novelsResponse.data);
        setProjects((prev) => {
          const existingSlugs = new Set(prev.map((p) => p.slug))
          return novels.map((novel) => {
            const baseSlug = generateSlug(novel.title || "untitled-novel")
            const uniqueSlug = novel.slug
              ? ensureUniqueSlug(novel.slug, Array.from(existingSlugs))
              : ensureUniqueSlug(baseSlug, Array.from(existingSlugs))
            existingSlugs.add(uniqueSlug)

            return {
              ...novel,
              slug: uniqueSlug,
            }
          })
        });
        setError(null);
      } catch (err) {
        setError("Failed to fetch novels.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNovels();
  }, []);

  const selectedNovel = selectedProject ? projects.find((p) => p.id === selectedProject) : null

  // Handle creating new novel - automatically set to Draft (no placeholder cover)
  const handleCreateNovel = (novelData: Partial<Project>) => {
    const baseSlug = generateSlug(novelData.title || "untitled-novel")
    const existingSlugs = projects.map((p) => p.slug)
    const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs)

    const newNovel: Project = {
      id: Date.now(),
      slug: uniqueSlug,
      title: novelData.title || "Untitled Novel",
      genre: novelData.genre || "Unknown",
      description: novelData.description || "",
      tags: novelData.tags || [],
      cover: novelData.cover || "",
      status: "Draft", // Always start as Draft
      chapters: 0,
      words: 0,
      views: 0,
      collections: 0,
      rating: 0,
      progress: 0,
      lastChapter: "",
      lastEdited: "Just now",
      lastUpdated: "Just now",
      wordCount: 0,
    }
    setProjects([newNovel, ...projects])
    setSelectedProject(newNovel.id)
    setIsCreateDialogOpen(false)
  }

  // Handle marking novel as completed
  const handleMarkAsCompleted = () => {
    if (selectedProject) {
          setProjects(projects.map((p) => (p.id === selectedProject ? { ...p, status: "Completed" } : p)))
    }
  }

  // Handle updating novel
  const handleUpdateNovel = (updatedNovel: Project) => {
    setProjects(projects.map((p) => (p.id === selectedProject ? updatedNovel : p)))
  }

  // If managing a specific novel
  if (selectedProject && selectedNovel) {
    return (
      <NovelManagement
        selectedNovel={selectedNovel}
        chapters={chapters}
        setChapters={setChapters}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        selectedChapter={selectedChapter}
        setSelectedChapter={setSelectedChapter}
        onBack={() => setSelectedProject(null)}
        onMarkAsCompleted={handleMarkAsCompleted}
        onUpdateNovel={handleUpdateNovel}
      />
    )
  }

  // Main Editor Page - Combined Novels and Editor
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Writing Studio</h1>
          <p className="text-muted-foreground mt-1">Manage your novels and continue writing</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Novel
        </Button>
      </div>

      {/* Stats Overview */}
      <StatsOverview totalNovels={projects.length} />

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search novels..."
              value={searchNovelsQuery}
              onChange={(e) => setSearchNovelsQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Novels Display */}
      <Tabs defaultValue="draft" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="draft" className="mt-0">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects
                .filter((p) => p.status === "Draft")
                .filter((p) => p.title.toLowerCase().includes(searchNovelsQuery.toLowerCase()))
                .map((project) => (
                  <UnifiedNovelCard 
                    key={project.id} 
                    variant="grid" 
                    data={project} 
                    onClick={() => setSelectedProject(project.id)} 
                  />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects
                .filter((p) => p.status === "Draft")
                .filter((p) => p.title.toLowerCase().includes(searchNovelsQuery.toLowerCase()))
                .map((project) => (
                  <UnifiedNovelCard 
                    key={project.id} 
                    variant="list" 
                    data={project} 
                    onClick={() => setSelectedProject(project.id)} 
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects
                .filter((p) => p.status === "Completed")
                .filter((p) => p.title.toLowerCase().includes(searchNovelsQuery.toLowerCase()))
                .map((project) => (
                  <UnifiedNovelCard 
                    key={project.id} 
                    variant="grid" 
                    data={project} 
                    onClick={() => setSelectedProject(project.id)} 
                  />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects
                .filter((p) => p.status === "Completed")
                .filter((p) => p.title.toLowerCase().includes(searchNovelsQuery.toLowerCase()))
                .map((project) => (
                  <UnifiedNovelCard 
                    key={project.id} 
                    variant="list" 
                    data={project} 
                    onClick={() => setSelectedProject(project.id)} 
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Writing Stats */}
      <WritingStats />

      <CreateNovelDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSave={handleCreateNovel} />
    </div>
  )
}
