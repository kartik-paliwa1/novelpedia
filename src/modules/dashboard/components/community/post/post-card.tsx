// Individual forum post card
"use client"

import { useEffect, useMemo, useState } from "react"

import { Card, CardContent } from "@/modules/dashboard/components/ui/card"
import { Button } from "@/modules/dashboard/components/ui/button"
import { Badge } from "@/modules/dashboard/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/dashboard/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/modules/dashboard/components/ui/dropdown-menu"
import { Textarea } from "@/modules/dashboard/components/ui/textarea"
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  Pin,
  TrendingUp,
  MoreHorizontal,
  Reply,
  Share2,
  Flag,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import type { CommunityComment, ForumPost } from "@/types/community"

interface PostCardProps {
  post: ForumPost
  onUpvote?: (id: number) => void
  onDownvote?: (id: number) => void
  onReply?: (postId: number, parentId: number | null, content: string) => Promise<void> | void
  onSave?: (id: number) => void
  onShare?: (id: number) => void
  onReport?: (id: number) => void
  isReplying?: boolean
}

export function PostCard({
  post,
  onUpvote,
  onDownvote,
  onReply,
  onSave,
  onShare,
  onReport,
  isReplying = false,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(() => (post.comments?.length ?? 0) > 0)
  const [replyParentId, setReplyParentId] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [localSuccess, setLocalSuccess] = useState<string | null>(null)

  const canReply = typeof onReply === 'function'
  const commentCount = post.commentCount ?? post.replies ?? 0
  const repliesLabel = commentCount === 1 ? 'reply' : 'replies'
  const hasComments = (post.comments?.length ?? 0) > 0

  useEffect(() => {
    if (hasComments) {
      setShowComments(true)
    }
  }, [hasComments])

  const replyTarget = useMemo(
    () => (replyParentId ? findCommentById(post.comments ?? [], replyParentId) : null),
    [post.comments, replyParentId]
  )

  const handleReplyClick = (parentId: number | null) => {
    setShowComments(true)
    if (!canReply) {
      return
    }

    setReplyParentId(parentId)
    setLocalError(null)
  }

  const handleSubmitReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canReply || !onReply) {
      return
    }

    if (!replyContent.trim()) {
      setLocalError('Please enter a comment before submitting.')
      return
    }

    setLocalError(null)
    setLocalSuccess(null)

    try {
      await onReply(post.id, replyParentId, replyContent.trim())
      setReplyContent('')
      setReplyParentId(null)
      setLocalSuccess('Reply posted!')
      setTimeout(() => setLocalSuccess(null), 2500)
    } catch (error: any) {
      const message = typeof error?.message === 'string' ? error.message : 'Unable to submit reply.'
      setLocalError(message)
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Moderator":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "Published Author":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "Veteran Writer":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Rising Author":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Bot":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  return (
    <Card
      className={`neumorphic transition-all duration-300 hover:shadow-lg novel-card ${
        post.isPinned ? "border-primary/30" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Title with Icons */}
                  <div className="flex items-center gap-2 mb-1">
                    {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                    {post.isHot && <TrendingUp className="h-4 w-4 text-red-500" />}
                    <h3 className="font-semibold hover:text-primary cursor-pointer transition-colors">
                      {post.title}
                    </h3>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <span className="font-medium">{post.author.name}</span>
                    <Badge variant="outline" className={getBadgeColor(post.author.badge)}>
                      {post.author.badge}
                    </Badge>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.timestamp}</span>
                    </div>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>
                      {commentCount} {repliesLabel}
                    </span>
                  </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onSave?.(post.id)}>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShare?.(post.id)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onReport?.(post.id)}>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => onUpvote?.(post.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {post.upvotes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => onDownvote?.(post.id)}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleReplyClick(null)}
                  disabled={!canReply}
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowComments((prev) => !prev)}
                >
                  {showComments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showComments ? 'Hide replies' : `View replies (${commentCount})`}
                </Button>
              </div>

              {showComments && (
                <div className="mt-4 space-y-4">
                  <form className="space-y-3" onSubmit={handleSubmitReply}>
                    {replyTarget && (
                      <p className="text-xs text-muted-foreground">
                        Replying to <span className="font-medium text-foreground">{replyTarget.author.name}</span>
                      </p>
                    )}
                    <Textarea
                      value={replyContent}
                      onChange={(event) => setReplyContent(event.target.value)}
                      placeholder={canReply ? 'Share your thoughts with the community…' : 'Sign in to join the conversation.'}
                      disabled={!canReply || isReplying}
                      rows={3}
                      className="bg-[#313052] text-sm"
                    />
                    {localError && (
                      <p className="text-xs text-red-400">{localError}</p>
                    )}
                    {localSuccess && (
                      <p className="text-xs text-emerald-400">{localSuccess}</p>
                    )}
                    <div className="flex justify-end gap-2">
                      {replyParentId !== null && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => setReplyParentId(null)}
                        >
                          Cancel reply
                        </Button>
                      )}
                      <Button
                        type="submit"
                        size="sm"
                        className="gap-2"
                        disabled={!canReply || isReplying || !replyContent.trim()}
                      >
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Reply className="h-4 w-4" />}
                        {isReplying ? 'Submitting…' : 'Post reply'}
                      </Button>
                    </div>
                  </form>

                  {hasComments ? (
                    <CommentThread comments={post.comments ?? []} onSelectReply={(commentId) => handleReplyClick(commentId)} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {canReply
                        ? 'No replies yet. Start the conversation!'
                        : 'No replies yet. Sign in to be the first to respond.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const formatRelativeDate = (timestamp: string) => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return timestamp
  }

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`

  return date.toLocaleDateString()
}

const findCommentById = (comments: CommunityComment[], id: number | null): CommunityComment | null => {
  if (id === null) {
    return null
  }

  for (const comment of comments) {
    if (comment.id === id) {
      return comment
    }

    const child = findCommentById(comment.children ?? [], id)
    if (child) {
      return child
    }
  }

  return null
}

interface CommentThreadProps {
  comments: CommunityComment[]
  onSelectReply: (commentId: number) => void
  depth?: number
}

function CommentThread({ comments, onSelectReply, depth = 0 }: CommentThreadProps) {
  if (!comments || comments.length === 0) {
    return null
  }

  return (
    <div className={depth === 0 ? 'space-y-4' : 'space-y-4 border-l border-violet-700/30 pl-4'}>
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.avatar || '/placeholder.svg'} />
              <AvatarFallback>
                {comment.author.name
                  .split(' ')
                  .map((name) => name[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{comment.author.name}</span>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  {comment.author.badge}
                </Badge>
                <span>•</span>
                <span>{formatRelativeDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{comment.body}</p>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs h-7 px-2"
                onClick={() => onSelectReply(comment.id)}
              >
                <Reply className="h-3 w-3" />
                Reply
              </Button>
            </div>
          </div>
          {comment.children && comment.children.length > 0 && (
            <CommentThread comments={comment.children} onSelectReply={onSelectReply} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  )
}
