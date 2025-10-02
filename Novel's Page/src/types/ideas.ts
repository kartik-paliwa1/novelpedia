// Type definitions for the ideas module

export interface WritingResource {
  id: number
  type: "video" | "article" | "podcast"
  platform: string
  title: string
  author: string
  duration?: string
  readTime?: string
  views: string
  rating: number
  thumbnail: string
  description: string
  tags: string[]
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

export interface WritingPrompt {
  id: number
  text: string
  category?: string
  difficulty?: "Easy" | "Medium" | "Hard"
  tags?: string[]
}

export interface WritingTool {
  id: number
  title: string
  description: string
  category: string
  action: string
  icon?: string
}

export interface ResourceFilters {
  searchQuery: string
  selectedCategory: string
  selectedDifficulty: string
}

export interface ResourceStats {
  videos: number
  articles: number
  podcasts: number
  prompts: number
}
