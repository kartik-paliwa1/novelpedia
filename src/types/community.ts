// Type definitions for the community module

export interface Author {
  name: string
  avatar: string
  reputation: number
  badge: string
}

export interface ForumPost {
  id: number
  title: string
  author: Author
  content: string
  category: string
  tags: string[]
  timestamp: string
  replies: number
  upvotes: number
  views: number
  isPinned: boolean
  isHot: boolean
  comments?: CommunityComment[]
  commentCount?: number
}

export interface CommunityComment {
  id: number
  body: string
  author: Author
  createdAt: string
  updatedAt?: string
  parentId?: number | null
  children: CommunityComment[]
}

export interface Category {
  name: string
  count: number
  color: string
}

export interface ForumFilters {
  searchQuery: string
  selectedCategory: string
  sortBy: "hot" | "new" | "top"
}

export interface CommunityStats {
  activeMembers: number
  totalPosts: number
  postsToday: number
  solvedQuestions: number
}

export interface TopContributor {
  name: string
  posts: number
  reputation: number
  avatar?: string
}

export interface NewPostData {
  title: string
  content: string
  category: string
  tags?: string[]
}
