// Main community page component with forum posts, categories, and stats
"use client"

import { useState } from "react"
import { CommunityStatsComponent } from "./community-stats"
import { ForumFiltersComponent } from "./forum/forum-filters"
import { CategoriesSidebar } from "./forum/categories-sidebar"
import { TopContributors } from "./forum/top-contributors"
import { PostCard } from "./post/post-card"
import { NewPostDialog } from "./dialogs/new-post-dialog"
import { type ForumPost, type Category, type ForumFilters, type NewPostData } from "@/types/community"

// Mock data - this would typically come from an API or database
const mockPosts: ForumPost[] = [
  {
    id: 1,
    title: "How do you handle writer's block?",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 1250,
      badge: "Veteran Writer",
    },
    content:
      "I've been struggling with writer's block for the past two weeks. My fantasy novel is at a crucial point and I just can't seem to move forward. What techniques do you use to overcome this?",
    category: "Writing Help",
    tags: ["writer's block", "fantasy", "advice"],
    timestamp: "2 hours ago",
    replies: 23,
    upvotes: 45,
    views: 234,
    isPinned: false,
    isHot: true,
  },
  {
    id: 2,
    title: "Beta readers wanted for YA romance novel",
    author: {
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 890,
      badge: "Rising Author",
    },
    content:
      "Looking for 3-4 beta readers for my completed YA romance novel (75k words). It's about two teenagers who meet at a summer music camp. I'm particularly looking for feedback on pacing and character development.",
    category: "Beta Reading",
    tags: ["beta reading", "YA", "romance", "feedback"],
    timestamp: "4 hours ago",
    replies: 12,
    upvotes: 28,
    views: 156,
    isPinned: false,
    isHot: false,
  },
  {
    id: 3,
    title: "📌 Community Guidelines and Rules - Please Read",
    author: {
      name: "Admin Team",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 5000,
      badge: "Moderator",
    },
    content:
      "Welcome to the NovelPedia Community! Please take a moment to read our community guidelines to ensure a positive experience for everyone.",
    category: "Announcements",
    tags: ["rules", "guidelines", "community"],
    timestamp: "1 week ago",
    replies: 8,
    upvotes: 67,
    views: 1240,
    isPinned: true,
    isHot: false,
  },
  {
    id: 4,
    title: "Self-publishing vs Traditional: My experience",
    author: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 2100,
      badge: "Published Author",
    },
    content:
      "After trying both routes, I wanted to share my honest experience with self-publishing and traditional publishing. Here's what I learned...",
    category: "Publishing",
    tags: ["self-publishing", "traditional", "experience", "advice"],
    timestamp: "1 day ago",
    replies: 34,
    upvotes: 89,
    views: 567,
    isPinned: false,
    isHot: true,
  },
  {
    id: 5,
    title: "Weekly Writing Challenge: Describe a color without naming it",
    author: {
      name: "Challenge Bot",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 0,
      badge: "Bot",
    },
    content:
      "This week's creative writing challenge: Write a paragraph describing a color without ever naming the color itself. Let's see your creativity!",
    category: "Challenges",
    tags: ["challenge", "creative writing", "weekly"],
    timestamp: "3 days ago",
    replies: 67,
    upvotes: 123,
    views: 890,
    isPinned: false,
    isHot: true,
  },
]

const categories: Category[] = [
  { name: "Writing Help", count: 234, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { name: "Beta Reading", count: 89, color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { name: "Publishing", count: 156, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { name: "Challenges", count: 45, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { name: "Announcements", count: 12, color: "bg-red-500/10 text-red-400 border-red-500/20" },
  { name: "General Discussion", count: 78, color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
]

export function CommunityContent() {
  const [filters, setFilters] = useState<ForumFilters>({
    searchQuery: "",
    selectedCategory: "all",
    sortBy: "hot",
  })

  // Filter and sort posts
  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    
    const matchesCategory = 
      filters.selectedCategory === "all" || 
      post.category.toLowerCase() === filters.selectedCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (filters.sortBy) {
      case "hot":
        return b.upvotes + b.replies - (a.upvotes + a.replies)
      case "new":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      case "top":
        return b.upvotes - a.upvotes
      default:
        return 0
    }
  })

  // Event handlers
  const handleNewPost = (data: NewPostData) => {
    console.log("Creating new post:", data)
    // Implement post creation
  }

  const handleSaveDraft = (data: NewPostData) => {
    console.log("Saving draft:", data)
    // Implement draft saving
  }

  const handleUpvote = (id: number) => {
    console.log("Upvoting post:", id)
    // Implement upvote functionality
  }

  const handleDownvote = (id: number) => {
    console.log("Downvoting post:", id)
    // Implement downvote functionality
  }

  const handleReply = (id: number) => {
    console.log("Replying to post:", id)
    // Implement reply functionality
  }

  const handleSave = (id: number) => {
    console.log("Saving post:", id)
    // Implement save functionality
  }

  const handleShare = (id: number) => {
    console.log("Sharing post:", id)
    // Implement share functionality
  }

  const handleReport = (id: number) => {
    console.log("Reporting post:", id)
    // Implement report functionality
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Community Forum</h1>
          <p className="text-muted-foreground mt-1">
            Connect with fellow writers, share experiences, and get help with your writing journey
          </p>
        </div>
        <NewPostDialog
          categories={categories}
          onSubmit={handleNewPost}
          onSaveDraft={handleSaveDraft}
        />
      </div>

      {/* Stats */}
      <CommunityStatsComponent />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <CategoriesSidebar
            categories={categories}
            selectedCategory={filters.selectedCategory}
            onCategorySelect={(category) => setFilters({ ...filters, selectedCategory: category })}
          />
          <TopContributors />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <ForumFiltersComponent filters={filters} onFiltersChange={setFilters} />

          {/* Posts */}
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
                onReply={handleReply}
                onSave={handleSave}
                onShare={handleShare}
                onReport={handleReport}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
