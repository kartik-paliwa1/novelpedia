// Type definitions for the editor module

export interface Project {
  id: number
  slug: string
  title: string
  lastChapter: string
  lastEdited: string
  wordCount: number
  status: "Draft" | "Completed"
  genre: string
  chapters: number
  words: number
  views: number
  collections: number
  rating: number
  lastUpdated: string
  cover: string
  description: string
  tags: string[]
  progress: number
}

export interface Chapter {
  id: number
  title: string
  wordCount: number
  publishedAt: string
  status: "completed" | "draft"
  order: number
  content?: string
}

export interface NovelFormData {
  title: string
  genre: string
  description: string
  tags: string[]
  cover: string
  targetAudience?: string
  language?: string
  plannedLength?: string
  updateSchedule?: string
}

export interface Novel {
  id: number
  title: string
  genre: string
  description: string
  tags: string[]
  cover: string
}
