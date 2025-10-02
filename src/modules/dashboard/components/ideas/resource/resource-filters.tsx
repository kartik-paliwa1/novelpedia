// Search and filter controls for resources (category and difficulty filters)
"use client"

import { Button } from "@/modules/dashboard/components/ui/button"
import { Input } from "@/modules/dashboard/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/modules/dashboard/components/ui/dropdown-menu"
import { Search, Filter, ChevronDown } from "lucide-react"
import { ResourceFilters } from "@/types/ideas"

interface ResourceFiltersProps {
  filters: ResourceFilters
  onFiltersChange: (filters: ResourceFilters) => void
}

export function ResourceFiltersComponent({ filters, onFiltersChange }: ResourceFiltersProps) {
  const updateFilters = (updates: Partial<ResourceFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Category
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => updateFilters({ selectedCategory: "all" })}>
              All Categories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedCategory: "writing basics" })}>
              Writing Basics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedCategory: "character building" })}>
              Character Building
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedCategory: "world building" })}>
              World Building
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedCategory: "story structure" })}>
              Story Structure
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedCategory: "writing craft" })}>
              Writing Craft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedCategory: "publishing" })}>
              Publishing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Difficulty Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Level
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => updateFilters({ selectedDifficulty: "all" })}>
              All Levels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedDifficulty: "beginner" })}>
              Beginner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedDifficulty: "intermediate" })}>
              Intermediate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ selectedDifficulty: "advanced" })}>
              Advanced
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
