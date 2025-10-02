"use client"

import { useEffect, useMemo, useState } from "react"

import { CommunityStatsComponent } from '@/modules/dashboard/components/community/community-stats'
import { ForumFiltersComponent } from '@/modules/dashboard/components/community/forum/forum-filters'
import { CategoriesSidebar } from '@/modules/dashboard/components/community/forum/categories-sidebar'
import { TopContributors } from '@/modules/dashboard/components/community/forum/top-contributors'
import { PostCard } from '@/modules/dashboard/components/community/post/post-card'
import { NewPostDialog } from '@/modules/dashboard/components/community/dialogs/new-post-dialog'
import { type ForumPost, type Category, type ForumFilters, type NewPostData, type CommunityComment } from "@/types/community"
import { api, type Comment, type Tag } from "@/services/api"
import { Loader2 } from "lucide-react"

const fallbackCategories: Category[] = [
  { name: "Writing Help", count: 0, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { name: "Beta Reading", count: 0, color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { name: "Publishing", count: 0, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { name: "Challenges", count: 0, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { name: "Announcements", count: 0, color: "bg-red-500/10 text-red-400 border-red-500/20" },
  { name: "General Discussion", count: 0, color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
]

const colorPalette = [
  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "bg-green-500/10 text-green-400 border-green-500/20",
  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "bg-red-500/10 text-red-400 border-red-500/20",
  "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
]

const extractAuthor = (author: any) => ({
  name: String(author?.name ?? author?.username ?? "Anonymous"),
  avatar: String(author?.avatar ?? author?.profile_image ?? "/placeholder.svg?height=40&width=40"),
  reputation: Number(author?.reputation ?? author?.score ?? 0),
  badge: String(author?.badge ?? author?.role ?? "Member"),
})

const normalizePost = (post: any, comments: CommunityComment[] = []): ForumPost => {
  const author = post?.author ?? {}
  const commentCount = countNestedComments(comments)

  return {
    id: Number(post?.id ?? post?.pk ?? Date.now()),
    title: String(post?.title ?? post?.name ?? "Untitled Post"),
    author: extractAuthor(author),
    content: String(post?.body ?? post?.content ?? ""),
    category: String(post?.category?.name ?? post?.category ?? "General"),
    tags: Array.isArray(post?.tags)
      ? post.tags.map((tag: any) => (typeof tag === "string" ? tag : String(tag?.name ?? tag?.title ?? "tag")))
      : [],
    timestamp: String(post?.created_at ?? post?.timestamp ?? "Just now"),
    replies: commentCount || Number(post?.replies_count ?? post?.comments?.length ?? 0),
    upvotes: Number(post?.upvotes ?? post?.likes ?? 0),
    views: Number(post?.views ?? post?.view_count ?? 0),
    isPinned: Boolean(post?.is_pinned ?? post?.pinned ?? false),
    isHot: Boolean(post?.is_hot ?? post?.hot ?? false),
    comments,
    commentCount: commentCount || undefined,
  }
}

const normalizeComment = (comment: Comment): CommunityComment => {
  const author = extractAuthor(comment?.author ?? (comment as any)?.user ?? {})
  const createdAt = String(comment?.created_at ?? comment?.createdAt ?? new Date().toISOString())
  const updatedAt = comment?.updated_at ?? (comment as any)?.updatedAt
  const parentId = (() => {
    const parent = comment?.parent ?? (comment as any)?.parent_id ?? (comment as any)?.parentId
    if (typeof parent === 'number') return parent
    if (typeof parent === 'string') {
      const parsed = Number(parent)
      return Number.isNaN(parsed) ? null : parsed
    }
    if (parent && typeof parent === 'object') {
      const candidate = (parent as any)?.id ?? (parent as any)?.pk
      const parsed = Number(candidate)
      return Number.isNaN(parsed) ? null : parsed
    }
    return null
  })()

  return {
    id: Number(comment?.id ?? comment?.pk ?? Date.now()),
    body: String(comment?.body ?? comment?.content ?? ''),
    author,
    createdAt,
    updatedAt: updatedAt ? String(updatedAt) : undefined,
    parentId,
    children: [],
  }
}

const extractPostIdFromComment = (comment: Comment): number | null => {
  const { post } = comment as any
  if (typeof post === 'number') return post
  if (typeof post === 'string') {
    const parsed = Number(post)
    return Number.isNaN(parsed) ? null : parsed
  }
  if (post && typeof post === 'object') {
    const candidate = post.id ?? post.pk ?? post.post_id ?? post.slug
    if (typeof candidate === 'number') return candidate
    if (typeof candidate === 'string') {
      const parsed = Number(candidate)
      return Number.isNaN(parsed) ? null : parsed
    }
  }
  return null
}

const sortCommentTree = (comments: CommunityComment[]): CommunityComment[] =>
  comments
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((comment) => ({
      ...comment,
      children: sortCommentTree(comment.children ?? []),
    }))

const buildCommentTree = (comments: Comment[]): Map<number, CommunityComment[]> => {
  const normalized = new Map<number, CommunityComment>()
  comments.forEach((comment) => {
    const normalizedComment = normalizeComment(comment)
    normalized.set(normalizedComment.id, normalizedComment)
  })

  const byPost = new Map<number, CommunityComment[]>()

  comments.forEach((comment) => {
    const normalizedComment = normalized.get(Number(comment.id))
    if (!normalizedComment) {
      return
    }

    const parentId = normalizedComment.parentId
    if (parentId && normalized.has(parentId)) {
      const parent = normalized.get(parentId)!
      parent.children = [...parent.children, normalizedComment]
      return
    }

    const postId = extractPostIdFromComment(comment)
    if (postId !== null) {
      const existing = byPost.get(postId) ?? []
      byPost.set(postId, [...existing, normalizedComment])
    }
  })

  byPost.forEach((value, key) => {
    byPost.set(key, sortCommentTree(value))
  })

  return byPost
}

const countNestedComments = (comments: CommunityComment[]): number =>
  comments.reduce((total, comment) => total + 1 + countNestedComments(comment.children ?? []), 0)

const appendCommentToTree = (
  comments: CommunityComment[] = [],
  newComment: CommunityComment,
  parentId: number | null
): { tree: CommunityComment[]; inserted: boolean } => {
  if (parentId === null) {
    return {
      tree: sortCommentTree([...comments, { ...newComment, children: newComment.children ?? [] }]),
      inserted: true,
    }
  }

  let inserted = false
  const next = comments.map((comment) => {
    if (comment.id === parentId) {
      inserted = true
      return {
        ...comment,
        children: sortCommentTree([...comment.children, { ...newComment, children: newComment.children ?? [] }]),
      }
    }

    const childResult = appendCommentToTree(comment.children, newComment, parentId)
    if (childResult.inserted) {
      inserted = true
      return {
        ...comment,
        children: childResult.tree,
      }
    }

    return comment
  })

  return {
    tree: inserted ? next : comments,
    inserted,
  }
}

const buildCategoriesFromTags = (tags: Tag[] | undefined): Category[] => {
  if (!tags || tags.length === 0) {
    return fallbackCategories
  }

  return tags.map((tag, index) => ({
    name: tag.name,
    count: Number((tag as any)?.usage_count ?? (tag as any)?.count ?? 0),
    color: colorPalette[index % colorPalette.length],
  }))
}

export function CommunityContent() {
  const [filters, setFilters] = useState<ForumFilters>({
    searchQuery: "",
    selectedCategory: "all",
    sortBy: "hot",
  })
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [replyingPostId, setReplyingPostId] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadCommunity = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [postsResponse, tagsResponse, commentsResponse] = await Promise.allSettled([
          api.getPosts(),
          api.getTags(),
          api.getComments(),
        ])

        if (!isMounted) return

        const commentTreeLookup =
          commentsResponse.status === "fulfilled" && Array.isArray(commentsResponse.value.data)
            ? buildCommentTree(commentsResponse.value.data)
            : new Map<number, CommunityComment[]>()

        if (postsResponse.status === "fulfilled") {
          const incoming = Array.isArray(postsResponse.value.data)
            ? postsResponse.value.data.map((post) => {
                const postId = Number(post?.id ?? post?.pk ?? Date.now())
                const tree = commentTreeLookup.get(postId) ?? []
                return normalizePost(post, tree)
              })
            : []
          setPosts(incoming)
        } else {
          setPosts([])
          setError(postsResponse.reason?.message ?? "Failed to load community posts")
        }

        if (tagsResponse.status === "fulfilled") {
          const tagData = Array.isArray(tagsResponse.value.data) ? tagsResponse.value.data : []
          setCategories(buildCategoriesFromTags(tagData))
        } else {
          setCategories(fallbackCategories)
        }
      } catch (err: any) {
        if (!isMounted) return
        setError(err?.message ?? "Unable to load community content")
        setPosts([])
        setCategories(fallbackCategories)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCommunity()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredPosts = useMemo(() => {
    const searchQuery = filters.searchQuery.toLowerCase()

    return posts
      .filter((post) => {
        const matchesSearch =
          !searchQuery ||
          post.title.toLowerCase().includes(searchQuery) ||
          post.content.toLowerCase().includes(searchQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery))

        const matchesCategory =
          filters.selectedCategory === "all" ||
          post.category.toLowerCase() === filters.selectedCategory.toLowerCase()

        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "new":
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          case "top":
            return b.upvotes - a.upvotes
          case "hot":
          default:
            return b.upvotes + b.replies - (a.upvotes + a.replies)
        }
      })
  }, [filters.searchQuery, filters.selectedCategory, filters.sortBy, posts])

  const handleNewPost = async (data: NewPostData) => {
    try {
      setIsSubmittingPost(true)
      const response = await api.createPost({
        title: data.title,
        body: data.content,
        category: data.category,
        tags: data.tags,
      })

      const created = normalizePost(response.data, [])
      setPosts((prev) => [created, ...prev])
    } catch (err: any) {
      setError(err?.message ?? "Failed to publish post")
    } finally {
      setIsSubmittingPost(false)
    }
  }

  const handleSaveDraft = async (data: NewPostData) => {
    console.log("Saving draft:", data)
  }

  const handleUpvote = (id: number) => {
    console.log("Upvoting post:", id)
  }

  const handleDownvote = (id: number) => {
    console.log("Downvoting post:", id)
  }

  const handleReply = async (postId: number, parentId: number | null, body: string) => {
    try {
      setReplyingPostId(postId)
      const response = await api.createComment({
        body,
        parent: parentId ?? undefined,
        post: postId,
      })

      const normalized = normalizeComment(response.data)

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) {
            return post
          }

          const { tree, inserted } = appendCommentToTree(post.comments ?? [], normalized, parentId)
          const nextTree = inserted
            ? tree
            : sortCommentTree([...(post.comments ?? []), normalized])
          const commentCount = countNestedComments(nextTree)

          return {
            ...post,
            comments: nextTree,
            replies: commentCount,
            commentCount,
          }
        })
      )
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit reply")
      throw err
    } finally {
      setReplyingPostId(null)
    }
  }

  const handleSave = (id: number) => {
    console.log("Saving post:", id)
  }

  const handleShare = (id: number) => {
    console.log("Sharing post:", id)
  }

  const handleReport = (id: number) => {
    console.log("Reporting post:", id)
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
          isSubmitting={isSubmittingPost}
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
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading posts…</span>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  onReply={handleReply}
                  onSave={handleSave}
                  onShare={handleShare}
                  onReport={handleReport}
                  isReplying={replyingPostId === post.id}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                {error ?? "No posts match your filters yet."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
