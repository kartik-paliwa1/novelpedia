// Type definitions for the editor module

export interface Project {
  id: number
  slug: string
  title: string
  lastChapter: string
  lastEdited: string
  wordCount: number
  status: "Ongoing" | "Completed"
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
  primaryGenre?: { id: number; name: string } | null
  contentType?: string
  language?: string
  plannedLength?: string
  maturityRating?: string
}

export interface Chapter {
  id: number
  slug?: string | null
  title: string
  wordCount: number
  publishedAt: string | null
  status: "published" | "draft"
  order: number
  content?: string
  contentDelta?: unknown
  images?: string[]
  heroImageUrl?: string | null
}

export interface NovelFormData {
  title: string
  description: string
  shortDescription?: string
  cover: string
  coverFile?: File | null
  primaryGenreId: number | null
  genreIds: number[]
  tagIds: number[]
  contentType: string
  language: string
  plannedLength: string
  maturityRating: string
  // Optional name fields for auto-creation fallback
  tagNames?: string[]
  genreNames?: string[]
  primaryGenreName?: string
}

export interface Novel {
  id: number
  title: string
  genre: string
  description: string
  tags: string[]
  cover: string
}
