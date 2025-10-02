"use client"

import { useEffect, useMemo, useState } from "react"
import { Filter, Grid3X3, List, Plus, RefreshCw, Search } from "lucide-react"
import { Button } from "@/modules/dashboard/components/ui/button"
import { Input } from "@/modules/dashboard/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/dashboard/components/ui/select"
import { NovelDisplayCard } from "@/modules/dashboard/components/novel/novel-display-card"
import { StatsOverview } from "@/modules/dashboard/components/editor/stats/stats-overview"
import { WritingStats } from "@/modules/dashboard/components/editor/stats/writing-stats"
// import { generateSlug, ensureUniqueSlug } from "@/utils/slug-utils"
import { Project } from "@/types/editor"
import { api, Genre } from "@/services/api"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function EditorNovelList() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchNovelsQuery, setSearchNovelsQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Draft" | "Completed">("all")
  const [sortKey, setSortKey] = useState<"updated" | "views" | "rating">("updated")
  const [genreFilter, setGenreFilter] = useState<number | "all">("all")
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([])
  const [metadataLoading, setMetadataLoading] = useState(false)

  const fetchGenres = async () => {
    setMetadataLoading(true)
    try {
      const response = await api.getGenres({ ordering: "name" })
      setAvailableGenres(response.data ?? [])
    } catch (err) {
      console.error("Failed to fetch genres", err)
    } finally {
      setMetadataLoading(false)
    }
  }

  const fetchNovels = async () => {
    setIsLoading(true)
    try {
      const response = await api.getAuthorNovels()
      const novels = Array.isArray(response.data) ? response.data : []
      setProjects(novels)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch novels:", err)
      setError("Failed to load your novels. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      void fetchNovels()
      void fetchGenres()
    }
  }, [isAuthenticated])
  // Handle novel selection - navigate to novel management using slug
  const handleSelectNovel = (novelSlug: string) => {
    router.push(`/dashboard/editor/${novelSlug}`)
  }

  const filteredProjects = useMemo(() => {
    const searchLower = searchNovelsQuery.toLowerCase().trim()
    return projects
      .filter((project) => {
        const matchesSearch =
          !searchLower ||
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchLower))

        const matchesStatus = statusFilter === "all" || project.status === statusFilter
        const matchesGenre =
          genreFilter === "all" || project.primaryGenre?.id === genreFilter

        return matchesSearch && matchesStatus && matchesGenre
      })
      .sort((a, b) => {
        switch (sortKey) {
          case "views":
            return b.views - a.views
          case "rating":
            return b.rating - a.rating
          case "updated":
          default:
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        }
      })
  }, [projects, searchNovelsQuery, statusFilter, genreFilter, sortKey])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to access the Writing Studio and create novels.</p>
          <Button onClick={() => router.push('/login')} size="lg">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Writing Studio</h1>
          <p className="text-muted-foreground mt-1">Manage your novels and continue writing</p>
        </div>
        <Button onClick={() => router.push('/novel/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Novel
        </Button>
      </div>

      {/* Stats Overview */}
      <StatsOverview totalNovels={projects.length} />

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Filters and Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, synopsis, or tag"
              value={searchNovelsQuery}
              onChange={(event) => setSearchNovelsQuery(event.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={genreFilter === "all" ? "all" : String(genreFilter)}
              onValueChange={(value) => setGenreFilter(value === "all" ? "all" : Number(value))}
              disabled={metadataLoading}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genres</SelectItem>
                {availableGenres.map((genre) => (
                  <SelectItem key={genre.id} value={String(genre.id)}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortKey} onValueChange={(value) => setSortKey(value as typeof sortKey)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Recently updated</SelectItem>
                <SelectItem value="views">Most viewed</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button variant="outline" size="icon" onClick={() => void fetchNovels()} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Novels Display (all at once) */}
      {(() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
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
                    ? `No novels found matching "${searchNovelsQuery}"`
                    : "You haven't created any novels yet. Start writing your first web novel!"}
                </p>
                {!searchNovelsQuery && (
                  <Button onClick={() => router.push('/novel/create')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Novel
                  </Button>
                )}
              </div>
            </div>
          )
        }

        return viewMode === "grid" ? (
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
        ) : (
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

      {/* Writing Stats */}
      <WritingStats />
    </div>
  )
}

