// Individual forum post card
"use client"

import { Card, CardContent } from "@/components/dashboard/ui/card"
import { Button } from "@/components/dashboard/ui/button"
import { Badge } from "@/components/dashboard/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/dashboard/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dashboard/ui/dropdown-menu"
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
} from "lucide-react"
import { ForumPost } from "@/types/community"

interface PostCardProps {
  post: ForumPost
  onUpvote?: (id: number) => void
  onDownvote?: (id: number) => void
  onReply?: (id: number) => void
  onSave?: (id: number) => void
  onShare?: (id: number) => void
  onReport?: (id: number) => void
}

export function PostCard({
  post,
  onUpvote,
  onDownvote,
  onReply,
  onSave,
  onShare,
  onReport,
}: PostCardProps) {
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
                      <span>{post.replies} replies</span>
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
                  onClick={() => onReply?.(post.id)}
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
