// Re-export all ideas components for easier imports
export { IdeasContent } from '@/modules/dashboard/components/ideas/ideas-content'
export { IdeasStats } from '@/modules/dashboard/components/ideas/ideas-stats'

// Resource components
export { ResourceCard } from '@/modules/dashboard/components/ideas/resource/resource-card'
export { ResourceFiltersComponent } from '@/modules/dashboard/components/ideas/resource/resource-filters'
export { ResourceGrid } from '@/modules/dashboard/components/ideas/resource/resource-grid'

// Prompts components
export { WritingPrompts } from '@/modules/dashboard/components/ideas/prompts/writing-prompts'

// Tools components
export { WritingTools } from '@/modules/dashboard/components/ideas/tools/writing-tools'

// Re-export types for convenience
export type {
  WritingResource,
  WritingPrompt,
  WritingTool,
  ResourceFilters,
  ResourceStats
} from "@/types/ideas"
