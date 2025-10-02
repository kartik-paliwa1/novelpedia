
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChapterEditor } from "@/components/dashboard/editor/chapter/chapter-editor"
import type { Project, Chapter } from "@/types/editor"
import { api } from "@/services/api"

const sanitizeContent = (html: string | undefined): string => {
  if (!html) {
    return ""
  }

  if (typeof window !== "undefined") {
    const container = document.createElement("div")
    container.innerHTML = html



    // Remove all images
    const images = container.querySelectorAll("img")
    images.forEach((img) => img.remove())

    // Filter function to preserve only allowed formatting
    const filterNode = (node: Node): Node | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Preserve useful writing symbols and characters
        const text = node.textContent || ""
        // Keep: letters, numbers, spaces, basic punctuation, quotes, brackets, angle brackets, dashes, etc.
        const filteredText = text.replace(/[^\w\s.,!?;:"'`()[\]{}<>\-—–_+=*&^%$#@~|\\\/\n\r]/g, "")
        const newNode = document.createTextNode(filteredText)
        return newNode
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        const tagName = element.tagName.toLowerCase()
        
        // Allow specific formatting tags and preserve their content (including author notes)
        if (['b', 'strong', 'i', 'em', 'u', 's', 'strike', 'sub', 'sup', 'p', 'br', 'blockquote', 'span', 'div'].includes(tagName)) {
          // Check if this is an author note by class name
          const isAuthorNote = element.className && element.className.includes('novel-author-note')

          
          // For span tags, only allow if they have the novel-author-note class
          if (tagName === 'span' && !isAuthorNote) {
            // Process children but don't keep the span tag itself
            const fragment = document.createDocumentFragment()
            for (let i = 0; i < element.childNodes.length; i++) {
              const filteredChild = filterNode(element.childNodes[i])
              if (filteredChild) {
                fragment.appendChild(filteredChild)
              }
            }
            return fragment
          }
          // For div tags, only allow if they have the novel-author-note class
          if (tagName === 'div' && !isAuthorNote) {
            // Process children but don't keep the div tag itself
            const fragment = document.createDocumentFragment()
            for (let i = 0; i < element.childNodes.length; i++) {
              const filteredChild = filterNode(element.childNodes[i])
              if (filteredChild) {
                fragment.appendChild(filteredChild)
              }
            }
            return fragment
          }
          const newElement = document.createElement(tagName)
          
          // Preserve important attributes for author notes
          if (isAuthorNote) {
            newElement.className = element.className
            if (element.getAttribute('contenteditable')) {
              newElement.setAttribute('contenteditable', element.getAttribute('contenteditable')!)
            }
            if (element.getAttribute('title')) {
              newElement.setAttribute('title', element.getAttribute('title')!)
            }
          }
          
          // Process child nodes recursively
          for (let i = 0; i < element.childNodes.length; i++) {
            const filteredChild = filterNode(element.childNodes[i])
            if (filteredChild) {
              newElement.appendChild(filteredChild)
            }
          }
          
          return newElement
        } else {
          // For other tags, process children but don't keep the tag itself
          const fragment = document.createDocumentFragment()
          for (let i = 0; i < element.childNodes.length; i++) {
            const filteredChild = filterNode(element.childNodes[i])
            if (filteredChild) {
              fragment.appendChild(filteredChild)
            }
          }
          return fragment
        }
      }
      
      return null
    }

    const filteredContainer = document.createElement("div")
    for (let i = 0; i < container.childNodes.length; i++) {
      const filteredChild = filterNode(container.childNodes[i])
      if (filteredChild) {
        filteredContainer.appendChild(filteredChild)
      }
    }

    const result = filteredContainer.innerHTML

    return result
  }

  // Server-side fallback - basic sanitization
  return html
    .replace(/<img[^>]*>/gi, "") // Remove images
    .replace(/<(?!\/?(b|strong|i|em|u|s|strike|sub|sup|p|br|blockquote|span|div)\b)[^>]*>/gi, "") // Remove non-allowed tags (keep author note spans/divs)
    .replace(/[^\w\s.,!?;:"'`()[\]{}<>\-—–_+=*&^%$#@~|\\\/=]/g, "") // Preserve useful writing symbols and = for attributes
}

const htmlToParagraphs = (html: string | undefined): string[] => {
  if (!html) {
    return []
  }

  if (typeof window !== "undefined") {
    const container = document.createElement("div")
    container.innerHTML = html

    const blocks = container.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, blockquote, li"
    )
    const paragraphs: string[] = []

    if (blocks.length > 0) {
      blocks.forEach((node) => {
        let text = node.textContent?.trim() ?? ""
        if (!text) {
          return
        }

        if (node.tagName.toLowerCase() === "li") {
          const parent = node.parentElement
          if (parent?.tagName.toLowerCase() === "ol") {
            const index = Array.from(parent.children).indexOf(node) + 1
            text = `${index}. ${text}`
          } else {
            text = `• ${text}`
          }
        }

        paragraphs.push(text)
      })

      return paragraphs
    }

    const fallback = container.textContent?.trim() ?? ""
    return fallback ? [fallback] : []
  }

  const normalized = html
    .replace(/<\/(p|div|h[1-6]|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>(\s*<br\s*\/?>)*/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, "")

  return normalized
    .split(/\n+/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)
}

interface ChapterEditorRouteProps {
  novelSlug: string
  chapterId: string
}

export function ChapterEditorRoute({ novelSlug, chapterId }: ChapterEditorRouteProps) {
  const router = useRouter()
  const [novel, setNovel] = useState<Project | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      try {
        const novelsResp = await api.getMyNovels()
        const novels = Array.isArray(novelsResp.data) ? (novelsResp.data as Project[]) : []
        const foundNovel = novels.find((project) => project.slug === novelSlug)

        if (!foundNovel) {
          router.push("/dashboard/editor")
          return
        }

        if (!isMounted) {
          return
        }

        setNovel(foundNovel)

        const chaptersResp = await api.getChapters(novelSlug)
        const allChapters = Array.isArray(chaptersResp.data) ? (chaptersResp.data as Chapter[]) : []
        const sortedChapters = [...allChapters].sort((a, b) => a.order - b.order)

        if (!isMounted) {
          return
        }

        const numericId = Number(chapterId)
        const foundChapter = sortedChapters.find((item) => item.id === numericId)

        if (foundChapter) {
          setChapter(foundChapter)
        } else {
          router.push(`/dashboard/editor/${novelSlug}`)
        }
      } catch (error) {
        console.error("Failed to load chapter editor data:", error)
        router.push("/dashboard/editor")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [novelSlug, chapterId, router])

  const handleSave = async (updatedChapter: Chapter) => {
    try {
      // Sanitize content before saving - remove unwanted formatting, images, and special characters
      const sanitizedContent = sanitizeContent(updatedChapter.content)
      const paragraphs = htmlToParagraphs(sanitizedContent)
      
      // Remove all images since we're filtering them out
      const heroImageData = ''

      const autosaveResponse = await api.autosaveChapter(updatedChapter.id, {
        title: updatedChapter.title,
        paragraphs,
        content_html: sanitizedContent,
        content_delta: updatedChapter.contentDelta,
        hero_image_data: heroImageData,
        is_published: updatedChapter.status === "published",
      })

      const updateResponse = await api.updateChapter(updatedChapter.id, {
        title: updatedChapter.title,
        status: updatedChapter.status,
      })

      const autosaveData = autosaveResponse?.data ?? {}
      const normalizedContent =
        typeof autosaveData?.content_html === "string"
          ? autosaveData.content_html
          : sanitizedContent
      const normalizedDelta = autosaveData?.content_delta ?? updatedChapter.contentDelta
      const heroImageUrl = null // Always null since we're filtering out images
      const normalizedImages: string[] = [] // Always empty since we're filtering out images

      const updatedStatus = updateResponse?.data?.status ?? updatedChapter.status
      const updatedPublishedAt = updateResponse?.data?.publishedAt ?? updatedChapter.publishedAt ?? null

      const persistedChapter: Chapter = {
        ...updatedChapter,
        content: normalizedContent,
        contentDelta: normalizedDelta,
        images: normalizedImages,
        heroImageUrl,
        status: updatedStatus,
        publishedAt: updatedPublishedAt,
        id: chapter?.id ?? updatedChapter.id, // Ensure we preserve the original chapter ID
      }

      setChapter(persistedChapter)
      console.log("Chapter saved:", {
        ...persistedChapter,
        paragraphsCount: paragraphs.length,
      })
      return persistedChapter
    } catch (error) {
      console.error("Failed to save chapter:", error)
      // TODO: Add proper error handling with toast notifications
      return undefined
    }
  }

  const handleChapterTitleUpdate = async (title: string) => {
    const trimmed = title.trim()
    if (!chapter) {
      console.error("Cannot update chapter title: chapter is null")
      return
    }

    console.log("Updating chapter title:", { chapterId: chapter.id, title: trimmed })

    try {
      const response = await api.updateChapter(chapter.id, { title: trimmed })
      console.log("Chapter title update response:", response)
      
      if (response?.data) {
        // Preserve the original chapter ID and merge with response data
        setChapter((prev) => {
          if (!prev) return response.data
          const updated = {
            ...prev,
            ...response.data,
            id: prev.id, // Ensure ID is preserved
          }
          console.log("Chapter state updated:", { oldId: prev.id, newData: response.data, finalId: updated.id })
          return updated
        })
      } else {
        console.log("No response data, updating title locally")
        setChapter((prev) => (prev ? { ...prev, title: trimmed } : prev))
      }
    } catch (error) {
      console.error("Failed to update chapter title:", error)
      console.error("Chapter ID at time of error:", chapter?.id)
      throw error
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/editor/${novelSlug}`)
  }

  if (isLoading && (!novel || !chapter)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center text-muted-foreground">
          Loading chapter editor...
        </div>
      </div>
    )
  }

  if (!novel || !chapter) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            {!novel ? "Novel not found" : "Chapter not found"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {!novel
              ? "The novel you're looking for doesn't exist."
              : "The chapter you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ChapterEditor
      chapter={chapter}
      onSave={handleSave}
      onBack={handleBack}
      onUpdateChapterTitle={handleChapterTitleUpdate}
    />
  )
}
