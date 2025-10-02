/**
 * Messages Sidebar Component
 * 
 * Left sidebar containing:
 * - Search functionality for filtering messages
 * - List of message categories with counts and previews
 * - Category selection and highlighting
 * 
 * Provides the main navigation interface for browsing different
 * types of messages and notifications.
 */

import { Search } from "lucide-react"
import { Card, CardContent } from "@/modules/dashboard/components/ui/card"
import { Input } from "@/modules/dashboard/components/ui/input"
import { Badge } from "@/modules/dashboard/components/ui/badge"
import type { SidebarCategory } from "@/types/messages"

interface MessagesSidebarProps {
  categories: SidebarCategory[]
  selectedCategory: string | null
  searchQuery: string
  onCategorySelect: (categoryId: string) => void
  onSearchChange: (query: string) => void
}

export function MessagesSidebar({
  categories,
  selectedCategory,
  searchQuery,
  onCategorySelect,
  onSearchChange,
}: MessagesSidebarProps) {
  return (
    <Card className="neumorphic">
      <CardContent className="p-0">
        {/* Search Header */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-1 p-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-secondary ${
                selectedCategory === category.id ? "bg-primary/10 border border-primary/20" : ""
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                  <category.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <div className="flex items-center gap-1">
                      {category.unreadCount > 0 ? (
                        <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                          {category.unreadCount}
                        </Badge>
                      ) : category.count > 0 ? (
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{category.lastMessage}</p>
                  <p className="text-xs text-muted-foreground">{category.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
