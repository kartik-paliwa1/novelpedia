// Individual resource card component for videos, articles, and podcasts
"use client"

import { Card, CardContent } from "@/modules/dashboard/components/ui/card"
import { Button } from "@/modules/dashboard/components/ui/button"
import { Badge } from "@/modules/dashboard/components/ui/badge"
import {
  Play,
  ExternalLink,
  Star,
  Youtube,
  Bookmark,
} from "lucide-react"
import { WritingResource } from "@/types/ideas"

interface ResourceCardProps {
  resource: WritingResource
  onBookmark?: (id: number) => void
  onPlay?: (id: number) => void
}

export function ResourceCard({ resource, onBookmark, onPlay }: ResourceCardProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "YouTube":
        return <Youtube className="h-4 w-4 text-red-500" />
      default:
        return <ExternalLink className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Intermediate":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getActionText = () => {
    switch (resource.type) {
      case "video":
        return "Watch"
      case "podcast":
        return "Listen"
      default:
        return "Read"
    }
  }

  return (
    <Card className="neumorphic hover:shadow-lg transition-all duration-300 group novel-card">
      <CardContent className="p-0">
        <div className="relative">
          {/* Thumbnail */}
          <div className="aspect-video w-full rounded-t-xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${resource.thumbnail})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Type Badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
                {resource.type}
              </Badge>
            </div>
            
            {/* Platform Icon */}
            <div className="absolute top-2 right-2">
              {getPlatformIcon(resource.platform)}
            </div>
            
            {/* Duration/Read Time */}
            <div className="absolute bottom-2 right-2">
              <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
                {resource.duration || resource.readTime}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 space-y-2">
            {/* Title and Rating */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {resource.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{resource.rating}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {resource.description}
            </p>

            {/* Author and Views */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">by {resource.author}</span>
              <span className="flex-shrink-0">{resource.views} views</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className={`${getDifficultyColor(resource.difficulty)} text-xs`}>
                {resource.difficulty}
              </Badge>
              {resource.tags.slice(0, 1).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-1 pt-1">
              <Button 
                size="sm" 
                className="flex-1 gap-1 h-7 text-xs"
                onClick={() => onPlay?.(resource.id)}
              >
                <Play className="h-3 w-3" />
                {getActionText()}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent h-7 w-7 p-0"
                onClick={() => onBookmark?.(resource.id)}
              >
                <Bookmark className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
