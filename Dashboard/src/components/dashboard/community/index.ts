// Re-export all community components for easier imports
export { CommunityContent } from "./community-content"
export { CommunityStatsComponent } from "./community-stats"

// Forum components
export { ForumFiltersComponent } from "./forum/forum-filters"
export { CategoriesSidebar } from "./forum/categories-sidebar"
export { TopContributors } from "./forum/top-contributors"

// Post components
export { PostCard } from "./post/post-card"

// Dialog components
export { NewPostDialog } from "./dialogs/new-post-dialog"

// Re-export types for convenience
export type {
  Author,
  ForumPost,
  Category,
  ForumFilters,
  CommunityStats,
  TopContributor,
  NewPostData,
} from "@/types/community"
