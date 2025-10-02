// Re-export all community components for easier imports
export { CommunityContent } from '@/modules/dashboard/components/community/community-content'
export { CommunityStatsComponent } from '@/modules/dashboard/components/community/community-stats'

// Forum components
export { ForumFiltersComponent } from '@/modules/dashboard/components/community/forum/forum-filters'
export { CategoriesSidebar } from '@/modules/dashboard/components/community/forum/categories-sidebar'
export { TopContributors } from '@/modules/dashboard/components/community/forum/top-contributors'

// Post components
export { PostCard } from '@/modules/dashboard/components/community/post/post-card'

// Dialog components
export { NewPostDialog } from '@/modules/dashboard/components/community/dialogs/new-post-dialog'

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
