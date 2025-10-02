/**
 * Category Overview Cards Component
 * 
 * Displays a grid of interactive cards showing message categories with:
 * - Category icon and color
 * - Message count
 * - Category name and description
 * - Click functionality to filter messages
 * 
 * Features neumorphic design with hover effects and smooth transitions.
 */

import { Card, CardContent } from "@/components/dashboard/ui/card"
import type { MessageCategory } from "@/types/messages"

interface CategoryOverviewProps {
  categories: MessageCategory[]
  onCategorySelect: (categoryId: string) => void
}

export function CategoryOverview({ categories, onCategorySelect }: CategoryOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="neumorphic cursor-pointer hover:shadow-lg transition-all duration-300 group"
          onClick={() => onCategorySelect(category.id)}
        >
          <CardContent className="p-4 text-center">
            <div
              className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              <category.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-lg font-bold">{category.count}</div>
            <div className="text-xs text-muted-foreground font-medium">{category.name}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
