/**
 * Type definitions for the Messages module
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the messages system, including message data structures, categories,
 * and component props.
 */

export interface Message {
  id: number
  category: string
  type: string
  title: string
  message: string
  timestamp: string
  priority: 'low' | 'medium' | 'high'
  novelTitle?: string
  chapterTitle?: string
  read: boolean
}

export interface MessageCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  count: number
  description: string
}

export interface SidebarCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  count: number
  unreadCount: number
  lastMessage: string
  timestamp: string
  parentCategory: string
}

export interface MessageStats {
  totalMessages: number
  categoryCounts: Record<string, number>
}
