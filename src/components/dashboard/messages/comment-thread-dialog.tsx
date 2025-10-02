/**
 * Comment Thread Dialog Component
 * 
 * Modal dialog that displays a full comment thread for paragraph comments.
 * Shows the original comment, all replies, and allows interaction.
 * 
 * Features:
 * - Original comment with context (novel, chapter, paragraph)
 * - Threaded replies with author highlights
 * - Like/reply buttons
 * - Close and view chapter actions
 */

import { ExternalLink, Heart, MessageCircle, Book } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog"
import { Button } from "@/components/dashboard/ui/button"
import { Badge } from "@/components/dashboard/ui/badge"
import { ScrollArea } from "@/components/dashboard/ui/scroll-area"

interface CommentThread {
  id: string
  originalComment: {
    id: string
    user: string
    content: string
    timestamp: string
    likes: number
    isLiked: boolean
  }
  replies: Array<{
    id: string
    user: string
    content: string
    timestamp: string
    likes: number
    isLiked: boolean
    isAuthor: boolean
  }>
  context: {
    novelTitle: string
    chapterTitle: string
    chapterNumber: number
    paragraphSnippet: string
    author: string
  }
}

interface CommentThreadDialogProps {
  isOpen: boolean
  onClose: () => void
  thread: CommentThread | null
  onViewChapter?: () => void
  onLike?: (commentId: string) => void
  // onReply?: (commentId: string, content: string) => void // TODO: Future iteration
}

export function CommentThreadDialog({
  isOpen,
  onClose,
  thread,
  onViewChapter,
  onLike
}: CommentThreadDialogProps) {
  if (!thread) return null

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 bg-background border overflow-hidden flex flex-col" showCloseButton={false}>
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <MessageCircle className="h-6 w-6 text-primary" />
                Comment Thread
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
                <Book className="h-4 w-4" />
                <span className="font-medium text-foreground">{thread.context.novelTitle}</span>
                <span>•</span>
                <span>{thread.context.chapterTitle}</span>
                <span className="text-xs opacity-75">by {thread.context.author}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewChapter}
              className="gap-2 ml-4"
            >
              <ExternalLink className="h-4 w-4" />
              View Chapter
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="py-6 px-6 space-y-6">
            {/* Context/Paragraph Snippet */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">Referenced paragraph</p>
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                &ldquo;{thread.context.paragraphSnippet}...&rdquo;
              </p>
            </div>

            {/* Original Comment */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center text-sm font-semibold border border-primary/20">
                  {thread.originalComment.user.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">{thread.originalComment.user}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(thread.originalComment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{thread.originalComment.content}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-2 h-9 px-4 rounded-lg transition-colors ${
                        thread.originalComment.isLiked 
                          ? 'text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20' 
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => onLike?.(thread.originalComment.id)}
                    >
                      <Heart className={`h-4 w-4 ${thread.originalComment.isLiked ? 'fill-current' : ''}`} />
                      {thread.originalComment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 h-9 px-4 rounded-lg hover:bg-secondary">
                      <MessageCircle className="h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {thread.replies.length > 0 && (
                <div className="ml-6 space-y-4 border-l-2 border-primary/20 pl-6">
                  {thread.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-xs font-semibold border">
                        {reply.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{reply.user}</span>
                          {reply.isAuthor && (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                              Author
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground">{reply.content}</p>
                        <div className="flex items-center gap-4 pt-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`gap-1 h-8 px-3 text-xs rounded-md transition-colors ${
                              reply.isLiked 
                                ? 'text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20' 
                                : 'hover:bg-background'
                            }`}
                            onClick={() => onLike?.(reply.id)}
                          >
                            <Heart className={`h-3 w-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                            {reply.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 h-8 px-3 text-xs rounded-md hover:bg-background">
                            <MessageCircle className="h-3 w-3" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add some bottom padding for better scrolling */}
            <div className="pb-4">
              <p className="text-center text-sm text-muted-foreground">
                {thread.replies.length + 1} comment{thread.replies.length !== 0 ? 's' : ''} in this thread
              </p>
            </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
