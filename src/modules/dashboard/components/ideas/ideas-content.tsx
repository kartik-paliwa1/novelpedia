// Main ideas page component with resources, prompts, and tools tabs
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/dashboard/components/ui/tabs"
import { IdeasStats } from '@/modules/dashboard/components/ideas/ideas-stats'
import { ResourceFiltersComponent } from '@/modules/dashboard/components/ideas/resource/resource-filters'
import { ResourceGrid } from '@/modules/dashboard/components/ideas/resource/resource-grid'
import { WritingPrompts } from '@/modules/dashboard/components/ideas/prompts/writing-prompts'
import { WritingTools } from '@/modules/dashboard/components/ideas/tools/writing-tools'
import { type WritingResource, type ResourceFilters, type WritingTool } from "@/types/ideas"

// Mock data - this would typically come from an API or database
const mockResources: WritingResource[] = [
  {
    id: 1,
    type: "video",
    platform: "YouTube",
    title: "How to Write Your First Novel: Complete Beginner's Guide",
    author: "Brandon Sanderson",
    duration: "45:32",
    views: "2.1M",
    rating: 4.9,
    thumbnail: "/placeholder.svg?height=200&width=300",
    description:
      "Master fantasy author Brandon Sanderson shares his proven method for writing your first novel, covering plot structure, character development, and world-building.",
    tags: ["Beginner", "Plot Structure", "Fantasy"],
    category: "Writing Basics",
    difficulty: "Beginner",
  },
  {
    id: 2,
    type: "article",
    platform: "Medium",
    title: "The Psychology of Character Development",
    author: "Jane Smith",
    readTime: "12 min",
    views: "45K",
    rating: 4.7,
    thumbnail: "/placeholder.svg?height=200&width=300",
    description:
      "Deep dive into creating psychologically realistic characters that readers will connect with emotionally.",
    tags: ["Character Development", "Psychology", "Writing Tips"],
    category: "Character Building",
    difficulty: "Intermediate",
  },
  {
    id: 3,
    type: "video",
    platform: "YouTube",
    title: "World Building Masterclass for Fantasy Writers",
    author: "Hello Future Me",
    duration: "1:23:45",
    views: "890K",
    rating: 4.8,
    thumbnail: "/placeholder.svg?height=200&width=300",
    description:
      "Comprehensive guide to creating believable fantasy worlds, including geography, cultures, magic systems, and history.",
    tags: ["World Building", "Fantasy", "Advanced"],
    category: "World Building",
    difficulty: "Advanced",
  },
  {
    id: 4,
    type: "podcast",
    platform: "Spotify",
    title: "Writing Excuses: Plot vs Character",
    author: "Writing Excuses Team",
    duration: "18:42",
    views: "156K",
    rating: 4.6,
    thumbnail: "/placeholder.svg?height=200&width=300",
    description:
      "Award-winning podcast discussing the eternal debate between plot-driven and character-driven stories.",
    tags: ["Plot", "Character", "Storytelling"],
    category: "Story Structure",
    difficulty: "Intermediate",
  },
  {
    id: 5,
    type: "article",
    platform: "Writer's Digest",
    title: "Dialogue That Sings: Writing Realistic Conversations",
    author: "Robert McKee",
    readTime: "8 min",
    views: "78K",
    rating: 4.5,
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Learn the secrets of writing dialogue that sounds natural and advances your story.",
    tags: ["Dialogue", "Conversation", "Realism"],
    category: "Writing Craft",
    difficulty: "Beginner",
  },
  {
    id: 6,
    type: "video",
    platform: "YouTube",
    title: "Publishing Your Novel: Traditional vs Self-Publishing",
    author: "Jenna Moreci",
    duration: "32:18",
    views: "445K",
    rating: 4.4,
    thumbnail: "/placeholder.svg?height=200&width=300",
    description:
      "Comprehensive comparison of traditional and self-publishing routes, with pros, cons, and practical advice.",
    tags: ["Publishing", "Traditional", "Self-Publishing"],
    category: "Publishing",
    difficulty: "Intermediate",
  },
]

export function IdeasContent() {
  const [filters, setFilters] = useState<ResourceFilters>({
    searchQuery: "",
    selectedCategory: "all",
    selectedDifficulty: "all",
  })

  // Filter resources based on current filters
  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    
    const matchesCategory =
      filters.selectedCategory === "all" || 
      resource.category.toLowerCase() === filters.selectedCategory.toLowerCase()
    
    const matchesDifficulty =
      filters.selectedDifficulty === "all" || 
      resource.difficulty.toLowerCase() === filters.selectedDifficulty.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Event handlers
  const handleBookmark = (id: number) => {
    console.log("Bookmarking resource:", id)
    // Implement bookmark functionality
  }

  const handlePlay = (id: number) => {
    console.log("Playing resource:", id)
    // Implement play/open functionality
  }

  const handleUsePrompt = (prompt: string) => {
    console.log("Using prompt:", prompt)
    // Implement prompt usage (e.g., navigate to editor with prompt)
  }

  const handleSavePrompt = (prompt: string) => {
    console.log("Saving prompt:", prompt)
    // Implement prompt saving functionality
  }

  const handleGeneratePrompts = () => {
    console.log("Generating new prompts")
    // Implement prompt generation
  }

  const handleToolAction = (tool: WritingTool) => {
    console.log("Tool action:", tool)
    // Implement tool-specific actions
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Writing Ideas & Resources</h1>
          <p className="text-muted-foreground mt-1">
            Discover inspiration, tutorials, and resources to enhance your writing journey
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <IdeasStats />

      {/* Main Content Tabs */}
      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="resources">Learning Resources</TabsTrigger>
          <TabsTrigger value="prompts">Writing Prompts</TabsTrigger>
          <TabsTrigger value="tools">Writing Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          {/* Filters */}
          <ResourceFiltersComponent filters={filters} onFiltersChange={setFilters} />
          
          {/* Resources Grid */}
          <ResourceGrid 
            resources={filteredResources}
            onBookmark={handleBookmark}
            onPlay={handlePlay}
          />
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <WritingPrompts
            onUsePrompt={handleUsePrompt}
            onSavePrompt={handleSavePrompt}
            onGenerateNew={handleGeneratePrompts}
          />
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <WritingTools onToolAction={handleToolAction} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
