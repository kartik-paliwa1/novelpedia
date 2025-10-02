"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { MessagesHeader } from '@/modules/dashboard/components/messages/messages-header'
import { CategoryOverview } from '@/modules/dashboard/components/messages/category-overview'
import { MessagesSidebar } from '@/modules/dashboard/components/messages/messages-sidebar'
import { MessagesList } from '@/modules/dashboard/components/messages/messages-list'
import { CommentThreadDialog } from '@/modules/dashboard/components/messages/comment-thread-dialog'
import { Card, CardContent } from "@/modules/dashboard/components/ui/card"
import { messageCategories, sidebarCategories, allMessages } from "@/data/messages-mock-data"
import { filterMessages, filterMessagesByMainCategory, sortMessages } from "@/utils/message-utils"
import type { Message, SidebarCategory } from "@/types/messages"
import { api, type Comment, type Review, type CommentThreadNode } from "@/services/api"
import { API_BASE_URL } from '@/config/api'

const normalizeCommentMessage = (comment: Comment): Message => {
  const author = comment?.author as Record<string, any> | undefined
  const createdAt = comment?.created_at ?? comment?.createdAt ?? new Date().toISOString()

  return {
    id: Number(comment.id),
    category: "chapter-comments",
    type: "comment",
    title: author?.name ? `New comment from ${author.name}` : "New chapter comment",
    message: String(comment.body ?? ""),
    timestamp: String(createdAt),
    priority: "low",
    novelTitle: typeof (comment as any)?.novel === "object" ? (comment as any).novel?.title : undefined,
    chapterTitle: typeof (comment as any)?.chapter === "object" ? (comment as any).chapter?.title : undefined,
    read: Boolean((comment as any)?.read ?? false),
  }
}

const normalizeReviewMessage = (review: Review): Message => {
  const createdAt = review?.created_at ?? review?.updated_at ?? new Date().toISOString()
  const rating = Number(review?.rating ?? 0)
  const id = Number(review?.id ?? 0) + 100000

  return {
    id,
    category: "reviews",
    type: "review",
    title: `New review (${rating}/5)`,
    message: String(review?.body ?? review?.title ?? ""),
    timestamp: String(createdAt),
    priority: rating <= 2 ? "medium" : "low",
    novelTitle: typeof review?.novel === "object" ? (review.novel as any)?.title : undefined,
    read: Boolean((review as any)?.read ?? false),
  }
}

const mergeMessages = (comments: Comment[] = [], reviews: Review[] = []): Message[] => {
  const commentMessages = comments.map(normalizeCommentMessage)
  const reviewMessages = reviews.map(normalizeReviewMessage)

  const combined = [...commentMessages, ...reviewMessages]

  if (combined.length === 0) {
    return allMessages
  }

  return sortMessages(combined)
}

interface NormalizedThread {
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

const buildRealtimeUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_REALTIME_URL || API_BASE_URL

  try {
    const url = new URL(path, base.replace(/\/api\/?$/, '/'))
    if (url.protocol === 'http:') {
      url.protocol = 'ws:'
    } else if (url.protocol === 'https:') {
      url.protocol = 'wss:'
    }
    return url.toString()
  } catch (error) {
    console.warn('Failed to build realtime url', error)
    return null
  }
}

const flattenThreadReplies = (replies?: CommentThreadNode[]): CommentThreadNode[] => {
  if (!replies || replies.length === 0) {
    return []
  }

  return replies.flatMap((reply) => [reply, ...flattenThreadReplies(reply.replies)])
}

const normalizeThread = (thread: CommentThreadNode): NormalizedThread => {
  const author = thread.author as Record<string, any> | undefined
  const context = thread.context as Record<string, any> | undefined
  const replies = flattenThreadReplies(thread.replies)

  return {
    id: String(thread.id ?? Date.now()),
    originalComment: {
      id: String(thread.id ?? Date.now()),
      user: String(author?.name ?? author?.username ?? 'Anonymous'),
      content: String(thread.body ?? ''),
      timestamp: String(thread.created_at ?? thread.updated_at ?? new Date().toISOString()),
      likes: Number((thread as any)?.likes ?? 0),
      isLiked: Boolean((thread as any)?.is_liked ?? false),
    },
    replies: replies.map((reply) => {
      const replyAuthor = reply.author as Record<string, any> | undefined
      return {
        id: String(reply.id ?? Date.now()),
        user: String(replyAuthor?.name ?? replyAuthor?.username ?? 'Anonymous'),
        content: String(reply.body ?? ''),
        timestamp: String(reply.created_at ?? reply.updated_at ?? new Date().toISOString()),
        likes: Number((reply as any)?.likes ?? 0),
        isLiked: Boolean((reply as any)?.is_liked ?? false),
        isAuthor: Boolean((reply as any)?.is_author ?? false),
      }
    }),
    context: {
      novelTitle: String(context?.novel?.title ?? context?.novel_title ?? 'Unknown novel'),
      chapterTitle: String(context?.chapter?.title ?? context?.chapter_title ?? 'Chapter'),
      chapterNumber: Number(context?.chapter?.number ?? context?.chapter_number ?? 0),
      paragraphSnippet: String(context?.paragraphSnippet ?? context?.paragraph ?? thread.body ?? ''),
      author: String(context?.novel?.author?.name ?? context?.author ?? author?.name ?? 'Anonymous'),
    },
  }
}

const extractMessageFromRealtime = (payload: any): Message | null => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const resourceType = (payload.resource ?? payload.type ?? payload.event) as string | undefined
  const data = (payload.comment ?? payload.review ?? payload.payload ?? payload.data ?? payload) as Record<string, any>

  if (resourceType?.includes('review') || 'rating' in (data ?? {})) {
    return normalizeReviewMessage(data as Review)
  }

  if (resourceType?.includes('comment') || 'body' in (data ?? {})) {
    return normalizeCommentMessage(data as Comment)
  }

  return null
}

export function MessagesContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>(allMessages)
  const [sidebarCategoryState, setSidebarCategoryState] = useState<SidebarCategory[]>(sidebarCategories)
  const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false)
  const [activeThread, setActiveThread] = useState<NormalizedThread | null>(null)
  const [isThreadLoading, setIsThreadLoading] = useState(false)
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null)
  const [threadError, setThreadError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [realtimeBanner, setRealtimeBanner] = useState<string | null>(null)
  const realtimeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("")

  const markMessageRead = (messageId: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              read: true,
            }
          : message
      )
    )
  }

  const handleRealtimeUpdate = (incoming: Message) => {
    setMessages((prev) => {
      const exists = prev.some((message) => message.id === incoming.id)
      const updated = exists
        ? prev.map((message) => (message.id === incoming.id ? { ...incoming, read: false } : message))
        : [incoming, ...prev]

      return sortMessages(updated)
    })

    if (realtimeTimerRef.current) {
      clearTimeout(realtimeTimerRef.current)
    }

    setRealtimeBanner(incoming.title ?? 'New message received')
    realtimeTimerRef.current = setTimeout(() => {
      setRealtimeBanner(null)
    }, 4000)
  }

  const fetchThread = async (commentId: number) => {
    try {
      setIsThreadLoading(true)
      setThreadError(null)
      const response = await api.getCommentThread(commentId)
      setActiveThread(normalizeThread(response.data))
      markMessageRead(commentId)
    } catch (err: any) {
      const message = err?.message ?? 'Unable to load comment thread'
      setThreadError(typeof message === 'string' ? message : 'Unable to load comment thread')
      setActiveThread(null)
    } finally {
      setIsThreadLoading(false)
    }
  }

  const handleThreadDialogChange = (open: boolean) => {
    setIsThreadDialogOpen(open)
    if (!open) {
      setActiveThread(null)
      setActiveCommentId(null)
      setThreadError(null)
    }
  }

  const handleRetryThread = () => {
    if (activeCommentId !== null) {
      fetchThread(activeCommentId)
    }
  }

  const handleCloseThreadDialog = () => {
    handleThreadDialogChange(false)
  }

  useEffect(() => {
    let isMounted = true

    const loadMessages = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [commentsResponse, reviewsResponse] = await Promise.allSettled([
          api.getComments(),
          api.getReviews(),
        ])

        if (!isMounted) return

        const comments: Comment[] =
          commentsResponse.status === "fulfilled" && Array.isArray(commentsResponse.value.data)
            ? commentsResponse.value.data
            : []
        const reviews: Review[] =
          reviewsResponse.status === "fulfilled" && Array.isArray(reviewsResponse.value.data)
            ? reviewsResponse.value.data
            : []

        const normalized = mergeMessages(comments, reviews)
        setMessages(normalized)
      } catch (err: any) {
        if (!isMounted) return
        setError(err?.message ?? "Unable to load messages")
        setMessages(allMessages)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMessages()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const url = buildRealtimeUrl('/ws/notifications/')
    if (!url) {
      return
    }

    const socket = new WebSocket(url)

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        const incoming = extractMessageFromRealtime(parsed)
        if (incoming) {
          handleRealtimeUpdate(incoming)
        }
      } catch (parseError) {
        console.warn('Failed to process realtime event', parseError)
      }
    }

    socket.onerror = (event) => {
      console.warn('Realtime messaging error', event)
    }

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    setSidebarCategoryState((prev) =>
      prev.map((category) => {
        const categoryMessages = messages.filter((msg) => msg.category === category.id)
        const unreadCount = categoryMessages.filter((msg) => !msg.read).length

        return {
          ...category,
          count: categoryMessages.length,
          unreadCount,
        }
      })
    )
  }, [messages])

  useEffect(() => {
    return () => {
      if (realtimeTimerRef.current) {
        clearTimeout(realtimeTimerRef.current)
      }
    }
  }, [])

  const isMainCategory = messageCategories.some((cat) => cat.id === selectedCategory)

  const filteredMessages: Message[] = useMemo(() => {
    if (!selectedCategory) {
      return []
    }

    const matchesSearch = (message: Message) => {
      const query = sidebarSearchQuery.trim().toLowerCase()
      if (!query) {
        return true
      }

      const textFields = [message.title, message.message, message.novelTitle, message.chapterTitle]
      return textFields.some((field) => field?.toLowerCase().includes(query))
    }

    if (isMainCategory) {
      const base = filterMessagesByMainCategory(messages, selectedCategory, sidebarCategoryState)
      return sortMessages(base.filter(matchesSearch))
    }

    const base = filterMessages(messages, selectedCategory ?? undefined)
    return sortMessages(base.filter(matchesSearch))
  }, [isMainCategory, messages, selectedCategory, sidebarCategoryState, sidebarSearchQuery])

  const relevantSidebarCategories = useMemo(() => {
    if (!selectedCategory) {
      return []
    }

    const mainCategory = messageCategories.find((cat) => cat.id === selectedCategory)
    if (mainCategory) {
      return sidebarCategoryState.filter((cat) => cat.parentCategory === selectedCategory)
    }

    const selectedSubcategory = sidebarCategoryState.find((cat) => cat.id === selectedCategory)
    if (!selectedSubcategory?.parentCategory) {
      return []
    }

    return sidebarCategoryState.filter((cat) => cat.parentCategory === selectedSubcategory.parentCategory)
  }, [selectedCategory, sidebarCategoryState])

  const handleArchive = (messageId: number) => {
    console.log("Archive:", messageId)
  }

  const handleDelete = (messageId: number) => {
    console.log("Delete:", messageId)
  }

  const handleMarkAllRead = () => {
    if (!selectedCategory) return

    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        const isMainCategorySelection = messageCategories.some((cat) => cat.id === selectedCategory)
        if (isMainCategorySelection) {
          const subcategoryIds = sidebarCategoryState
            .filter((cat) => cat.parentCategory === selectedCategory)
            .map((cat) => cat.id)
          if (subcategoryIds.includes(message.category)) {
            return { ...message, read: true }
          }
        } else if (message.category === selectedCategory) {
          return { ...message, read: true }
        }
        return message
      })
    )
  }

  const handleMarkAllUnread = () => {
    if (!selectedCategory) return

    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        const isMainCategorySelection = messageCategories.some((cat) => cat.id === selectedCategory)
        if (isMainCategorySelection) {
          const subcategoryIds = sidebarCategoryState
            .filter((cat) => cat.parentCategory === selectedCategory)
            .map((cat) => cat.id)
          if (subcategoryIds.includes(message.category)) {
            return { ...message, read: false }
          }
        } else if (message.category === selectedCategory) {
          return { ...message, read: false }
        }
        return message
      })
    )
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleMessageClick = (messageId: number) => {
    const message = messages.find((item) => item.id === messageId)
    if (!message) {
      return
    }

    if (message.type === 'comment') {
      setActiveCommentId(messageId)
      setIsThreadDialogOpen(true)
      fetchThread(messageId)
    }
  }

  const mainCategoryOverview = useMemo(() =>
    messageCategories.map((category) => {
      const totalCount = sidebarCategoryState
        .filter((sub) => sub.parentCategory === category.id)
        .reduce((sum, sub) => sum + (sub.count || 0), 0)

      return {
        ...category,
        count: totalCount,
      }
    }),
  [sidebarCategoryState])

  return (
    <div className="space-y-8">
      <MessagesHeader />

      {realtimeBanner && (
        <div className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary">
          {realtimeBanner}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="shadow-md">
        <CardContent className="p-6">
          <CategoryOverview
            categories={mainCategoryOverview}
            onCategorySelect={handleCategorySelect}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <MessagesSidebar
          categories={sidebarCategoryState}
          selectedCategory={selectedCategory}
          searchQuery={sidebarSearchQuery}
          onCategorySelect={handleCategorySelect}
          onSearchChange={setSidebarSearchQuery}
        />

        <Card className="shadow-md">
          <CardContent className="p-0">
            <MessagesList
              messages={isLoading && filteredMessages.length === 0 ? [] : filteredMessages}
              selectedCategory={selectedCategory}
              categories={sidebarCategoryState}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onMarkAllRead={handleMarkAllRead}
              onMarkAllUnread={handleMarkAllUnread}
              onMessageClick={handleMessageClick}
            />
          </CardContent>
        </Card>
      </div>

      <CommentThreadDialog
        open={isThreadDialogOpen}
        onOpenChange={handleThreadDialogChange}
        thread={activeThread}
        isLoading={isThreadLoading}
        error={threadError}
        onRetry={handleRetryThread}
        onClose={handleCloseThreadDialog}
      />
    </div>
  )
}
