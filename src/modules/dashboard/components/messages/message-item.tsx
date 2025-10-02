/**
 * Individual Message Item Component
 * 
 * Renders a single message with:
 * - Message type icon and styling
 * - Read/unread visual indicators
 * - Message content and metadata
 * - Novel/chapter context information
 * - Action dropdown menu
 * 
 * Handles individual message interactions and state management.
 */

import { Clock, MoreHorizontal, Archive, Trash2 } from "lucide-react"
import { Button } from "@/modules/dashboard/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/dashboard/components/ui/dropdown-menu"
import type { Message } from "@/types/messages"
import { getMessageIcon } from "@/utils/message-utils"

interface MessageItemProps {
  message: Message
  onArchive: (messageId: number) => void
  onDelete: (messageId: number) => void
  onMessageClick?: (messageId: number) => void
}

export function MessageItem({ message, onArchive, onDelete, onMessageClick }: MessageItemProps) {
  const handleItemClick = () => {
    if (onMessageClick) {
      onMessageClick(message.id)
    }
  }

  return (
    <div 
      className={`p-4 rounded-lg border transition-all duration-200 hover:bg-secondary/50 bg-card ${
        onMessageClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleItemClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">{getMessageIcon(message.type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm">
                  {message.title}
                </h3>
              </div>

              {/* Message Content */}
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{message.message}</p>

              {/* Novel/Chapter Context */}
              {(message.novelTitle || message.chapterTitle) && (
                <div className="mb-2 p-2 rounded-md bg-secondary/50">
                  {message.novelTitle && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Novel:</span> {message.novelTitle}
                    </div>
                  )}
                  {message.chapterTitle && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Chapter:</span> {message.chapterTitle}
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{message.timestamp}</span>
              </div>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onArchive(message.id)}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(message.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
