"use client"

import { useState } from "react"
import { Grid3X3, List, Plus, Search } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { Input } from "@/components/dashboard/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs"
import { CreateNovelDialog } from "@/components/dashboard/editor/dialogs/create-novel-dialog"
import { NovelDisplayCard } from "@/components/dashboard/novel/novel-display-card"
import { StatsOverview } from "@/components/dashboard/editor/stats/stats-overview"
import { WritingStats } from "@/components/dashboard/editor/stats/writing-stats"
import { generateSlug, ensureUniqueSlug } from "@/lib/slug-utils"
import { Project } from "@/types/editor"
import { recentProjects } from "@/data/editor-mock-data"
import { useRouter } from "next/navigation"

export function EditorNovelList() {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [projects, setProjects] = useState(recentProjects)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchNovelsQuery, setSearchNovelsQuery] = useState("")

  // Handle creating new novel - automatically set to Draft
  const handleCreateNovel = (novelData: Partial<Project>) => {
    const baseSlug = generateSlug(novelData.title || "untitled-novel")
    const existingSlugs = projects.map(p => p.slug)
    const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs)
    
    const newNovel: Project = {
      id: Date.now(),
      slug: uniqueSlug,
      title: novelData.title || "Untitled Novel",
      genre: novelData.genre || "Unknown",
      description: novelData.description || "",
      tags: novelData.tags || [],
      cover: novelData.cover || "https://placehold.co/150x200/6b7280/ffffff?text=No+Cover",
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
    setIsCreateDialogOpen(false)
    // Navigate to the new novel using slug
    router.push(`/dashboard/editor/${newNovel.slug}`)
  }

  // Handle novel selection - navigate to novel management using slug
  const handleSelectNovel = (novelSlug: string) => {
    router.push(`/dashboard/editor/${novelSlug}`)
  }

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
                  <NovelDisplayCard 
                    key={project.id} 
                    variant="grid" 
                    data={project} 
                    onClick={() => handleSelectNovel(project.slug)} 
                  />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects
                .filter((p) => p.status === "Draft")
                .filter((p) => p.title.toLowerCase().includes(searchNovelsQuery.toLowerCase()))
                .map((project) => (
                  <NovelDisplayCard 
                    key={project.id} 
                    variant="list" 
                    data={project} 
                    onClick={() => handleSelectNovel(project.slug)} 
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
                  <NovelDisplayCard 
                    key={project.id} 
                    variant="grid" 
                    data={project} 
                    onClick={() => handleSelectNovel(project.slug)} 
                  />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects
                .filter((p) => p.status === "Completed")
                .filter((p) => p.title.toLowerCase().includes(searchNovelsQuery.toLowerCase()))
                .map((project) => (
                  <NovelDisplayCard 
                    key={project.id} 
                    variant="list" 
                    data={project} 
                    onClick={() => handleSelectNovel(project.slug)} 
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
