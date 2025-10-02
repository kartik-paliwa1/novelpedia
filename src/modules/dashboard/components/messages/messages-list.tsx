/**
 * Messages List Component
 * 
 * Main content area displaying:
 * - List of filtered messages
 * - Empty states when no messages
 * - Category header with actions
 * 
 * Handles message list rendering and bulk actions.
 */

import { Mail, Bell, CheckCircle, Circle, Gift } from "lucide-react"
import { Card, CardContent } from "@/modules/dashboard/components/ui/card"
import { Button } from "@/modules/dashboard/components/ui/button"
import { MessageItem } from '@/modules/dashboard/components/messages/message-item'
import type { Message, SidebarCategory } from "@/types/messages"

interface MessagesListProps {
  messages: Message[]
  selectedCategory: string | null
  categories: SidebarCategory[]
  onArchive: (messageId: number) => void
  onDelete: (messageId: number) => void
  onMarkAllRead: () => void
  onMarkAllUnread: () => void
  onMessageClick?: (messageId: number) => void
}

export function MessagesList({
  messages,
  selectedCategory,
  categories,
  onArchive,
  onDelete,
  onMarkAllRead,
  onMarkAllUnread,
  onMessageClick
}: MessagesListProps) {
  const selectedCategoryName = categories.find((cat) => cat.id === selectedCategory)?.name

  return (
    <Card className="neumorphic">
      <CardContent className="p-6">
        {!selectedCategory ? (
          /* Empty State - No Category Selected */
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a category to view messages</h3>
            <p className="text-muted-foreground">Choose a category from above to see your messages</p>
          </div>
        ) : selectedCategory === "gifts-rewards" ? (
          /* Coming Soon State - Gifts & Rewards */
          <div className="text-center py-16">
            <div className="mb-6">
              <Gift className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-foreground">Gifts & Rewards</h3>
            <h4 className="text-xl mb-4 text-muted-foreground">Coming Soon</h4>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re working on an exciting rewards system for our authors!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{selectedCategoryName}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onMarkAllRead}>
                  <CheckCircle className="h-4 w-4" />
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onMarkAllUnread}>
                  <Circle className="h-4 w-4" />
                  Mark All Unread
                </Button>
              </div>
            </div>

            {/* Messages List */}
            {messages.length === 0 ? (
              /* Empty State - No Messages in Category */
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No messages in this category</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onMessageClick={onMessageClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
