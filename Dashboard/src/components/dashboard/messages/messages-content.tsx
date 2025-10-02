"use client"

/**
 * Main Messages Content Component
 * 
 * Orchestrates the entire messages interface including:
 * - State management for selected categories and filters
 * - Message data processing and filtering
 * - Coordination between all child components
 * - Message actions (mark as read, archive, delete)
 * 
 * This is the main container component that brings together all
 * the modular message components into a cohesive interface.
 */

import { useState } from "react"
import { MessagesHeader } from "./messages-header"
import { CategoryOverview } from "./category-overview"
import { MessagesSidebar } from "./messages-sidebar"
import { MessagesList } from "./messages-list"
import { CommentThreadDialog } from "./comment-thread-dialog"
import { Card, CardContent } from "@/components/dashboard/ui/card"
import { Mail } from "lucide-react"
import { messageCategories, sidebarCategories, allMessages } from "@/data/messages-mock-data"
import { mockCommentThreads, getCommentThreadByMessageId } from "@/data/comment-threads-mock-data"
import { filterMessages, filterMessagesByMainCategory, sortMessages } from "@/lib/message-utils"
import type { Message, SidebarCategory } from "@/types/messages"

export function MessagesContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>(allMessages)
  
  // Comment thread dialog state
  const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false)
  const [selectedThread, setSelectedThread] = useState<string | null>(null)

  // Calculate message statistics (for future use)
  // const stats = calculateMessageStats(allMessages)

  // Filter and sort messages based on current selection
  const isMainCategory = messageCategories.some(cat => cat.id === selectedCategory)
  
  let filteredMessages: Message[]
  if (!selectedCategory) {
    filteredMessages = []
  } else if (isMainCategory) {
    // If main category is selected, show all messages from its subcategories
    let mainCategoryMessages = filterMessagesByMainCategory(messages, selectedCategory, sidebarCategories)
    
    // Apply search filter if there's a search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      mainCategoryMessages = mainCategoryMessages.filter(
        (message) =>
          message.title.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query) ||
          message.novelTitle?.toLowerCase().includes(query) ||
          message.chapterTitle?.toLowerCase().includes(query)
      )
    }
    filteredMessages = sortMessages(mainCategoryMessages)
  } else {
    // If subcategory is selected, show only messages from that specific subcategory
    filteredMessages = sortMessages(
      filterMessages(messages, selectedCategory, searchQuery)
    )
  }

  // Get relevant sidebar categories with updated counts
  const relevantSidebarCategories = selectedCategory 
    ? (() => {
        const isMainCategory = messageCategories.some(cat => cat.id === selectedCategory)
        let categories: SidebarCategory[]
        
        if (isMainCategory) {
          // If main category is selected, show its subcategories
          categories = sidebarCategories.filter(cat => cat.parentCategory === selectedCategory)
        } else {
          // If subcategory is selected, show all subcategories from the same parent
          const selectedSubcategory = sidebarCategories.find(cat => cat.id === selectedCategory)
          const parentCategory = selectedSubcategory?.parentCategory
          categories = parentCategory 
            ? sidebarCategories.filter(cat => cat.parentCategory === parentCategory)
            : []
        }
        
        // Update counts based on current message state
        return categories.map(category => {
          const categoryMessages = messages.filter(msg => msg.category === category.id)
          const unreadCount = categoryMessages.filter(msg => !msg.read).length
          const totalCount = categoryMessages.length
          
          return {
            ...category,
            count: totalCount,
            unreadCount: unreadCount
          }
        })
      })()
    : []

  // Message action handlers
  const handleArchive = (messageId: number) => {
    // In a real app, this would make an API call
    console.log("Archive:", messageId)
  }

  const handleDelete = (messageId: number) => {
    // In a real app, this would make an API call
    console.log("Delete:", messageId)
  }

  const handleMarkAllRead = () => {
    if (!selectedCategory) return
    
    setMessages(prevMessages => 
      prevMessages.map(message => {
        // Check if message belongs to current category or its subcategories
        const isMainCategory = messageCategories.some(cat => cat.id === selectedCategory)
        if (isMainCategory) {
          const subcategoryIds = sidebarCategories
            .filter(cat => cat.parentCategory === selectedCategory)
            .map(cat => cat.id)
          if (subcategoryIds.includes(message.category)) {
            return { ...message, read: true }
          }
        } else if (message.category === selectedCategory) {
          return { ...message, read: true }
        }
        return message
      })
    )
    console.log("Marked all as read in category:", selectedCategory)
  }

  const handleMarkAllUnread = () => {
    if (!selectedCategory) return
    
    setMessages(prevMessages => 
      prevMessages.map(message => {
        // Check if message belongs to current category or its subcategories
        const isMainCategory = messageCategories.some(cat => cat.id === selectedCategory)
        if (isMainCategory) {
          const subcategoryIds = sidebarCategories
            .filter(cat => cat.parentCategory === selectedCategory)
            .map(cat => cat.id)
          if (subcategoryIds.includes(message.category)) {
            return { ...message, read: false }
          }
        } else if (message.category === selectedCategory) {
          return { ...message, read: false }
        }
        return message
      })
    )
    console.log("Marked all as unread in category:", selectedCategory)
  }

  const handleCategorySelect = (categoryId: string) => {
    // If it's a main category, show its subcategories
    const isMainCategory = messageCategories.some(cat => cat.id === categoryId)
    if (isMainCategory) {
      setSelectedCategory(categoryId)
    } else {
      // If it's a subcategory, set it as selected for filtering
      setSelectedCategory(categoryId)
    }
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  // Comment thread handlers
  const handleMessageClick = (messageId: number) => {
    // Only show thread dialog for paragraph comments
    if (selectedCategory === "paragraph-comments") {
      const threadId = getCommentThreadByMessageId(messageId)
      if (threadId) {
        setSelectedThread(threadId)
        setIsThreadDialogOpen(true)
      }
    }
  }

  const handleCloseThreadDialog = () => {
    setIsThreadDialogOpen(false)
    setSelectedThread(null)
  }

  const handleViewChapter = () => {
    // In a real app, this would navigate to the chapter
    console.log("Navigate to chapter")
  }

  const handleLikeComment = (commentId: string) => {
    // In a real app, this would make an API call
    console.log("Like comment:", commentId)
  }

  const currentThread = selectedThread ? mockCommentThreads[selectedThread as keyof typeof mockCommentThreads] : null

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <MessagesHeader />

      {/* Quick Category Overview - Always visible */}
      <CategoryOverview categories={messageCategories} onCategorySelect={handleCategorySelect} />

      {/* Conditional Content Based on Selection */}
      {!selectedCategory ? (
        /* Default State - Show instruction card */
        <Card className="neumorphic">
          <CardContent className="p-12">
            <div className="text-center">
              <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a category to view messages</h3>
              <p className="text-muted-foreground">Choose one of the categories above to see your messages and notifications</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Category Selected - Show sidebar and messages */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Only show when category is selected */}
          <div className="lg:col-span-1">
            <MessagesSidebar
              categories={relevantSidebarCategories}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onCategorySelect={handleCategorySelect}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Messages Display */}
          <div className="lg:col-span-3">
            <MessagesList
              messages={filteredMessages}
              selectedCategory={selectedCategory}
              categories={relevantSidebarCategories}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onMarkAllRead={handleMarkAllRead}
              onMarkAllUnread={handleMarkAllUnread}
              onMessageClick={handleMessageClick}
            />
          </div>
        </div>
      )}

      {/* Comment Thread Dialog */}
      <CommentThreadDialog
        isOpen={isThreadDialogOpen}
        onClose={handleCloseThreadDialog}
        thread={currentThread}
        onViewChapter={handleViewChapter}
        onLike={handleLikeComment}
      />
    </div>
  )
}
