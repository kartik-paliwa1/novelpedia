/**
 * Message Utilities
 * 
 * Utility functions for message processing and display:
 * - Message type icon mapping
 * - Message filtering and sorting
 * - Status calculations
 * 
 * Centralizes message-related business logic for reuse across components.
 */

import React from "react"
import {
  MessageSquare,
  Star,
  Heart,
  Bell,
  Users,
  Mail,
  Settings,
  AlertCircle,
  Gift,
  GraduationCap,
  Zap,
} from "lucide-react"
import type { Message } from "@/types/messages"

/**
 * Returns the appropriate icon component for a message type
 */
export function getMessageIcon(type: string): React.ReactElement {
  switch (type) {
    case "comment":
      return React.createElement(MessageSquare, { className: "h-4 w-4 text-blue-500" })
    case "review":
      return React.createElement(Star, { className: "h-4 w-4 text-amber-500" })
    case "reaction":
      return React.createElement(Heart, { className: "h-4 w-4 text-red-500" })
    case "reply":
      return React.createElement(MessageSquare, { className: "h-4 w-4 text-green-500" })
    case "mention":
      return React.createElement(Bell, { className: "h-4 w-4 text-purple-500" })
    case "follower":
      return React.createElement(Users, { className: "h-4 w-4 text-green-500" })
    case "message":
      return React.createElement(Mail, { className: "h-4 w-4 text-blue-500" })
    case "maintenance":
      return React.createElement(Settings, { className: "h-4 w-4 text-gray-500" })
    case "reward":
      return React.createElement(Gift, { className: "h-4 w-4 text-pink-500" })
    case "security":
      return React.createElement(AlertCircle, { className: "h-4 w-4 text-red-500" })
    case "course":
      return React.createElement(GraduationCap, { className: "h-4 w-4 text-green-500" })
    case "feature":
      return React.createElement(Zap, { className: "h-4 w-4 text-purple-500" })
    default:
      return React.createElement(Bell, { className: "h-4 w-4 text-muted-foreground" })
  }
}

/**
 * Filters messages based on category and search query
 */
export function filterMessages(
  messages: Message[],
  category?: string,
  searchQuery?: string
): Message[] {
  let filtered = messages

  if (category) {
    // Filter by the exact category (subcategory)
    filtered = filtered.filter((message) => message.category === category)
  }

  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (message) =>
        message.title.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query) ||
        message.novelTitle?.toLowerCase().includes(query) ||
        message.chapterTitle?.toLowerCase().includes(query)
    )
  }

  return filtered
}

/**
 * Filters messages by main category (includes all subcategories)
 */
export function filterMessagesByMainCategory(
  messages: Message[],
  mainCategory: string,
  subcategories: { id: string; parentCategory: string }[]
): Message[] {
  const relevantSubcategoryIds = subcategories
    .filter(sub => sub.parentCategory === mainCategory)
    .map(sub => sub.id)
  
  return messages.filter(message => relevantSubcategoryIds.includes(message.category))
}

/**
 * Calculates message statistics
 */
export function calculateMessageStats(messages: Message[]) {
  const totalMessages = messages.length
  
  const categoryCounts = messages.reduce((acc, message) => {
    acc[message.category] = (acc[message.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalMessages,
    unreadMessages: 0, // Removed unread functionality
    categoryCounts,
  }
}

/**
 * Sorts messages by priority and timestamp
 */
export function sortMessages(messages: Message[]): Message[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  
  return [...messages].sort((a, b) => {
    // Sort by priority
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) {
      return priorityDiff
    }
    
    // Finally by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
}
