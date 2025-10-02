/**
 * Messages Module Barrel Export
 *
 * Centralizes all exports from the messages module for clean imports.
 * This follows the barrel export pattern used throughout the application
 * for better organization and easier imports.
 */

// Main component
export { MessagesContent } from '@/modules/dashboard/components/messages/messages-content'

// Subcomponents
export { MessagesHeader } from '@/modules/dashboard/components/messages/messages-header'
export { CategoryOverview } from '@/modules/dashboard/components/messages/category-overview'
export { MessagesSidebar } from '@/modules/dashboard/components/messages/messages-sidebar'
export { MessagesList } from '@/modules/dashboard/components/messages/messages-list'
export { MessageItem } from '@/modules/dashboard/components/messages/message-item'
export { CommentThreadDialog } from '@/modules/dashboard/components/messages/comment-thread-dialog'
