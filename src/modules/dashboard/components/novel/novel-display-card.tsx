"use client"

import Image from "next/image"
import { Badge } from "@/modules/dashboard/components/ui/badge"
import { Button } from "@/modules/dashboard/components/ui/button"
import { Card, CardContent } from "@/modules/dashboard/components/ui/card"
import { Progress } from "@/modules/dashboard/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/modules/dashboard/components/ui/dropdown-menu"
import { BookOpen, Calendar, Edit3, Eye, Heart, MoreHorizontal, Star, TrendingUp } from "lucide-react"
import { StatusBadge } from "@/modules/dashboard/components/ui/status-badge"
import { IconText } from "@/modules/dashboard/components/ui/icon-text"
import { cn } from "@/utils/utils"

// Union type for all possible novel data formats
interface BaseNovelData {
  title: string
  cover: string
  genre?: string
  description?: string
}

interface SimpleNovelData extends BaseNovelData {
  type: "policy" | "contest"
  badge?: string
}

interface DetailedNovelData extends BaseNovelData {
  id: number
  status: "Draft" | "Completed" | "Publishing"
  chapters: number
  words: number
  views: number
  collections: number
  rating: number
  lastUpdated: string
  tags: string[]
  progress: number
}

interface ProjectNovelData extends BaseNovelData {
  id: number
  status: "Draft" | "Completed"
  chapters: number
  words: number
  views: number
  collections: number
  rating: number
  lastUpdated: string
}

type NovelData = SimpleNovelData | DetailedNovelData | ProjectNovelData

interface NovelDisplayCardProps {
  variant: "simple" | "detailed" | "grid" | "list"
  data: NovelData
  onClick?: () => void
  onAction?: (action: string) => void
  className?: string
}

// Type guards
function isSimpleNovel(data: NovelData): data is SimpleNovelData {
  return 'type' in data
}

function isDetailedNovel(data: NovelData): data is DetailedNovelData {
  return 'id' in data && 'tags' in data && 'progress' in data
}

function isProjectNovel(data: NovelData): data is ProjectNovelData {
  return 'id' in data && !('tags' in data)
}

export function NovelDisplayCard({ 
  variant, 
  data, 
  onClick, 
  onAction, 
  className 
}: NovelDisplayCardProps) {
  
  // Helper function to format date
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'Never'
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
  }
  
  // Simple horizontal card for policies/contests
  if (variant === "simple" && isSimpleNovel(data)) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="flex h-full">
          <div className="relative w-1/3">
            <Image src={data.cover || "https://placehold.co/200x300/6b7280/ffffff?text=No+Cover"} alt={data.title} fill className="object-cover" />
          </div>
          <CardContent className="w-2/3 p-4 flex flex-col">
            {data.badge && (
              <Badge variant="outline" className="self-start mb-2 text-xs bg-primary/10 text-primary border-primary/20">
                {data.badge}
              </Badge>
            )}
            <h3 className="font-semibold text-sm mb-1">{data.title}</h3>
            <p className="text-xs text-muted-foreground">{data.description}</p>
            <div className="mt-auto pt-2">
              <StatusBadge status={data.type} />
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  // Detailed vertical card with full features
  if (variant === "detailed" && isDetailedNovel(data)) {
    return (
      <Card className={cn("novel-card group", className)}>
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-[3/4] w-full rounded-t-xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${data.cover || `https://placehold.co/400x600/6b7280/ffffff?text=${encodeURIComponent((data.title || 'No Cover').slice(0, 20))}`})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <StatusBadge status={data.status} variant="overlay" />
              </div>
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-black/20 hover:bg-black/40 text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onAction?.("view")}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction?.("edit")}>Edit Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction?.("analytics")}>View Analytics</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onAction?.("delete")}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-lg mb-1">{data.title}</h3>
                <p className="text-white/80 text-sm">{data.genre}</p>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>

              <div className="flex flex-wrap gap-1">
                {data.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <IconText icon={BookOpen}>{data.chapters} chapters</IconText>
                <IconText icon={Eye}>{Number(data.views ?? 0).toLocaleString()}</IconText>
                <IconText icon={Heart}>{data.collections}</IconText>
                <IconText icon={Star}>{data.rating > 0 ? data.rating : "N/A"}</IconText>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{data.progress}%</span>
                </div>
                <Progress value={data.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <IconText icon={Calendar} size="xs">Updated {formatDate(data.lastUpdated)}</IconText>
                <span>{Number((data as any).words ?? 0).toLocaleString()} words</span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2" onClick={() => onAction?.("edit")}>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={() => onAction?.("analytics")}>
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view card (compact vertical)
  if (variant === "grid" && (isProjectNovel(data) || isDetailedNovel(data))) {
    return (
      <Card className={cn("novel-card group cursor-pointer", className)} onClick={onClick}>
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-[4/5] w-full rounded-t-xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${data.cover || `https://placehold.co/300x400/6b7280/ffffff?text=${encodeURIComponent((data.title || 'No Cover').slice(0, 20))}`})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <StatusBadge status={data.status} variant="overlay" />
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-lg mb-1">{data.title}</h3>
                <p className="text-white/80 text-sm">{data.genre}</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <IconText icon={BookOpen} size="xs">{Number((data as any).chapters ?? 0)} chapters</IconText>
                <IconText icon={Eye} size="xs">{Number((data as any).views ?? 0).toLocaleString()}</IconText>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <IconText icon={Calendar} size="xs">Updated {formatDate(data.lastUpdated)}</IconText>
                <span>{Number((data as any).words ?? 0).toLocaleString()} words</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // List view card (horizontal compact)
  if (variant === "list" && (isProjectNovel(data) || isDetailedNovel(data))) {
    return (
      <Card className={cn("neumorphic cursor-pointer hover:shadow-lg transition-all duration-300", className)} onClick={onClick}>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-6">
            <div className="relative w-10 h-12 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${data.cover || `https://placehold.co/40x48/6b7280/ffffff?text=${encodeURIComponent((data.title || 'No Cover').slice(0, 10))}`})` }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold truncate">{data.title}</h3>
                <StatusBadge status={data.status} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{data.genre}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{Number((data as any).chapters ?? 0)} chapters</span>
                <span>{Number((data as any).words ?? 0).toLocaleString()} words</span>
                <span>{Number((data as any).views ?? 0).toLocaleString()} views</span>
                <span>{Number((data as any).collections ?? 0)} collections</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction?.(data.status === "Draft" ? "continue" : "manage")
                }}
              >
                {data.status === "Draft" ? "Continue Writing" : "Manage"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onAction?.("view")}>View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction?.("export")}>Export</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => onAction?.("delete")}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fallback
  return null
}
