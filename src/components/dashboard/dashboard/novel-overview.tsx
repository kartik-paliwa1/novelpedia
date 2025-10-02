"use client"

import { useState } from "react"
import { BookOpen, ChevronRight, Clock, Star, Users } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { Badge } from "@/components/dashboard/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/ui/select"
import { useRouter } from "next/navigation"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Project } from "@/types/editor"

export function NovelOverview() {
  const router = useRouter()
  const { novels, loading, error } = useDashboardData()
  const [selectedNovelId, setSelectedNovelId] = useState<number | null>(null)

  // Set initial selected novel when data loads
  const validNovels = novels || []
  if (validNovels.length > 0 && selectedNovelId === null) {
    setSelectedNovelId(validNovels[0].id)
  }

  const selectedNovel = validNovels.find((novel) => novel.id === selectedNovelId) || validNovels[0]

  // Helper functions
  const formatNumber = (num: number | undefined | null): string => {
    if (!num) return '0'
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'ongoing':
        return "bg-primary/10 text-primary border-primary/20"
      case 'draft':
        return "bg-amber-500/10 text-amber-400 border-amber-500/20"
      case 'completed':
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case 'paused':
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getCoverImage = (project: Project): string => {
    return project.cover || `https://placehold.co/200x300/3b82f6/ffffff?text=${encodeURIComponent(project.title.slice(0, 20))}`
  }

  const handleNewChapter = () => {
    if (selectedNovel) {
      router.push(`/dashboard/editor/${selectedNovel.slug}`)
    }
  }

  const handleEditNovel = () => {
    if (selectedNovel) {
      router.push(`/dashboard/editor/${selectedNovel.slug}`)
    }
  }

  const handleViewDetails = () => {
    if (selectedNovel && selectedNovel.slug) {
      router.push(`/dashboard/editor/${selectedNovel.slug}`)
    }
  }

  if (loading) {
    return (
      <div className="gradient-border">
        <div className="gradient-border-content">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Novel Overview</h2>
          </div>
          <div className="p-6 animate-pulse">
            <div className="h-4 bg-muted rounded mb-4"></div>
            <div className="h-32 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gradient-border">
        <div className="gradient-border-content">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Novel Overview</h2>
          </div>
          <div className="p-6">
            <p className="text-destructive">Failed to load novels: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!validNovels.length) {
    return (
      <div className="gradient-border">
        <div className="gradient-border-content">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Novel Overview</h2>
          </div>
          <div className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No novels yet</h3>
            <p className="text-muted-foreground mb-4">Create your first novel to get started</p>
            <Button onClick={() => router.push('/dashboard/editor')}>
              Create Novel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedNovel) {
    return null
  }

  return (
    <div className="gradient-border">
      <div className="gradient-border-content">
        {/* Novel Selector */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Novel Overview</h2>
            <Select
              value={selectedNovelId?.toString() || ''}
              onValueChange={(value) => setSelectedNovelId(Number.parseInt(value))}
            >
              <SelectTrigger className="w-fit min-w-48 max-w-80">
                <SelectValue placeholder="Select a novel" />
              </SelectTrigger>
              <SelectContent>
                {validNovels.map((novel) => (
                  <SelectItem key={novel.id} value={novel.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{novel.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {novel.status.toUpperCase()}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/4 h-48 md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 md:bg-gradient-to-r z-10"></div>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getCoverImage(selectedNovel)})` }}
            ></div>
            <div className="absolute bottom-4 left-4 z-20 md:hidden">
              <h3 className="text-lg font-bold text-white">{selectedNovel.title}</h3>
              <p className="text-xs text-white/80">{selectedNovel.genre}</p>
            </div>
          </div>

          <div className="p-6 w-full md:w-3/4">
            <div className="hidden md:block mb-2">
              <Badge
                variant="outline"
                className={getStatusColor(selectedNovel.status)}
              >
                {selectedNovel.status.toUpperCase()}
              </Badge>
            </div>

            <div className="hidden md:block">
              <h3 className="text-xl font-bold mb-1">{selectedNovel.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{selectedNovel.genre}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="neumorphic p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">Chapters</span>
                </div>
                <div className="text-2xl font-bold">{selectedNovel.chapters}</div>
              </div>

              <div className="neumorphic p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Views</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(selectedNovel.views)}</div>
              </div>

              <div className="neumorphic p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Star className="h-4 w-4" />
                  <span className="text-xs">Rating</span>
                </div>
                <div className="text-2xl font-bold">{selectedNovel.rating}</div>
              </div>

              <div className="neumorphic p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Last Updated</span>
                </div>
                <div className="text-sm font-medium">{formatDate(selectedNovel.lastUpdated)}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button onClick={handleViewDetails} variant="ghost" size="sm" className="text-primary">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </Button>

                <div className="flex gap-2">
                <Button
                  onClick={handleEditNovel}
                  variant="outline"
                  size="sm"
                  className="bg-transparent cursor-pointer"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleNewChapter}
                  size="sm"
                  className="relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 shimmer"></div>
                  <span className="relative">New Chapter</span>
                </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
