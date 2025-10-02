// Search & sort controls
"use client"

import { Button } from "@/components/dashboard/ui/button"
import { Input } from "@/components/dashboard/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dashboard/ui/dropdown-menu"
import { Search, Filter, ChevronDown } from "lucide-react"
import { ForumFilters } from "@/types/community"

interface ForumFiltersProps {
  filters: ForumFilters
  onFiltersChange: (filters: ForumFilters) => void
}

export function ForumFiltersComponent({ filters, onFiltersChange }: ForumFiltersProps) {
  const updateFilters = (updates: Partial<ForumFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Sort by {filters.sortBy}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => updateFilters({ sortBy: "hot" })}>
              Hot
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ sortBy: "new" })}>
              New
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateFilters({ sortBy: "top" })}>
              Top
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
