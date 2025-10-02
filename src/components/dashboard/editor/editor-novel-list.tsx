"use client"

import { useEffect, useMemo, useState } from "react"
import { Grid3X3, List, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/dashboard/ui/button"
import { Input } from "@/components/dashboard/ui/input"
import { StatsOverview } from "@/components/dashboard/editor/stats/stats-overview"
import { WritingStats } from "@/components/dashboard/editor/stats/writing-stats"
import { NovelDisplayCard } from "@/components/dashboard/novel/novel-display-card"
import { Project } from "@/types/editor"
import { api } from "@/services/api"

export function EditorNovelList() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchNovelsQuery, setSearchNovelsQuery] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadNovels = async () => {
      setIsLoading(true)
      try {
        const response = await api.getMyNovels()
        if (!cancelled) {
          const novels = Array.isArray(response.data) ? (response.data as Project[]) : []
          setProjects(novels)
          setError(null)
        }
      } catch (err) {
        console.error("Failed to load novels:", err)
        if (!cancelled) {
          setProjects([])
          setError("We couldn't load your novels. Please try again.")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadNovels()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredProjects = useMemo(() => {
    const searchLower = searchNovelsQuery.trim().toLowerCase()
    return projects.filter((project) => {
      if (!searchLower) {
        return true
      }
      const matchesTitle = project.title?.toLowerCase().includes(searchLower)
      const matchesDescription = project.description?.toLowerCase().includes(searchLower)
      const matchesTags = project.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      return Boolean(matchesTitle || matchesDescription || matchesTags)
    })
  }, [projects, searchNovelsQuery])

  const handleSelectNovel = (novelSlug: string) => {
    if (novelSlug) {
      router.push(`/dashboard/editor/${novelSlug}`)
    }
  }

  const handleCreateNovel = () => {
    router.push("/novel/create")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Writing Studio</h1>
          <p className="text-muted-foreground mt-1">Manage your novels and continue writing</p>
        </div>
        <Button onClick={handleCreateNovel} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Novel
        </Button>
      </div>

      <StatsOverview totalNovels={projects.length} />

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, synopsis, or tag"
              value={searchNovelsQuery}
              onChange={(event) => setSearchNovelsQuery(event.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {(() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Loading your novels...</p>
              </div>
            </div>
          )
        }

        if (filteredProjects.length === 0) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-semibold mb-2">No Novels Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchNovelsQuery
                    ? `No results matching "${searchNovelsQuery}"`
                    : "You haven't created any novels yet. Start your first project."}
                </p>
                {!searchNovelsQuery && (
                  <Button onClick={handleCreateNovel} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Novel
                  </Button>
                )}
              </div>
            </div>
          )
        }

        if (viewMode === "grid") {
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProjects.map((project) => (
                <NovelDisplayCard
                  key={project.id}
                  variant="grid"
                  data={project}
                  onClick={() => handleSelectNovel(project.slug)}
                />
              ))}
            </div>
          )
        }

        return (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <NovelDisplayCard
                key={project.id}
                variant="list"
                data={project}
                onClick={() => handleSelectNovel(project.slug)}
              />
            ))}
          </div>
        )
      })()}

      <WritingStats />
    </div>
  )
}
