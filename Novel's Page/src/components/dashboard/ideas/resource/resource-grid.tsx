// Grid layout container for displaying filtered resource cards
"use client"

import { ResourceCard } from "./resource-card"
import { WritingResource } from "@/types/ideas"

interface ResourceGridProps {
  resources: WritingResource[]
  onBookmark?: (id: number) => void
  onPlay?: (id: number) => void
}

export function ResourceGrid({ resources, onBookmark, onPlay }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No resources found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onBookmark={onBookmark}
          onPlay={onPlay}
        />
      ))}
    </div>
  )
}
