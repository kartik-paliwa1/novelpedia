// Re-export all ideas components for easier imports
export { IdeasContent } from "./ideas-content"
export { IdeasStats } from "./ideas-stats"

// Resource components
export { ResourceCard } from "./resource/resource-card"
export { ResourceFiltersComponent } from "./resource/resource-filters"
export { ResourceGrid } from "./resource/resource-grid"

// Prompts components
export { WritingPrompts } from "./prompts/writing-prompts"

// Tools components
export { WritingTools } from "./tools/writing-tools"

// Re-export types for convenience
export type { 
  WritingResource, 
  WritingPrompt, 
  WritingTool, 
  ResourceFilters, 
  ResourceStats 
} from "@/types/ideas"
