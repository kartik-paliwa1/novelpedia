"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { cn } from "@/lib/utils"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pages: (number | string)[] = []
  
  // Always show first page
  pages.push(1)
  
  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 2; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show ellipsis for large page counts
    if (currentPage <= 3) {
      // Near the start
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      pages.push('...')
      pages.push(currentPage - 1)
      pages.push(currentPage)
      pages.push(currentPage + 1)
      pages.push('...')
      pages.push(totalPages)
    }
  }
  
  if (totalPages <= 1) {
    return null
  }
  
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <div key={`ellipsis-${index}`} className="h-8 w-8 flex items-center justify-center">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          )
        }
        
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        )
      })}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
