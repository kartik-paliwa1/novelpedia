// Categories navigation
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Button } from "@/components/dashboard/ui/button"
import { Badge } from "@/components/dashboard/ui/badge"
import { Category } from "@/types/community"

interface CategoriesSidebarProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
}

export function CategoriesSidebar({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoriesSidebarProps) {
  return (
    <Card className="neumorphic">
      <CardHeader>
        <CardTitle className="text-base">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onCategorySelect("all")}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name.toLowerCase() ? "default" : "ghost"}
            className="w-full justify-between"
            onClick={() => onCategorySelect(category.name.toLowerCase())}
          >
            <span>{category.name}</span>
            <Badge variant="outline" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
