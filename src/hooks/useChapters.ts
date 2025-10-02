import { useState, useCallback, useMemo } from 'react'
import chapterService from '@/services/chapter.service'

interface Chapter {
  id: string
  title: string
  content: string
  wordCount: number
  order: number
  status: 'DRAFT' | 'PUBLISHED'
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

interface UseChaptersOptions {
  novelId?: string
  initialChapters?: Chapter[]
}

export function useChapters({ novelId, initialChapters = [] }: UseChaptersOptions) {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters)
  const [isLoading, setIsLoading] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sort chapters by order for display
  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => a.order - b.order)
  }, [chapters])

  const loadChapters = useCallback(async () => {
    if (!novelId) return

    setIsLoading(true)
    setError(null)
    try {
      const fetchedChapters = await chapterService.getChapters(novelId)
      setChapters(fetchedChapters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chapters')
    } finally {
      setIsLoading(false)
    }
  }, [novelId])

  const reorderChapters = useCallback(async (newOrder: Chapter[]) => {
    if (!novelId) return

    setIsReordering(true)
    setError(null)
    
    // Store the current state for potential rollback
    const originalChapters = chapters
    
    // Optimistically update local state
    const updatedChapters = newOrder.map((chapter, index) => ({
      ...chapter,
      order: index,
    }))
    setChapters(updatedChapters)

    try {
      const chapterOrders = updatedChapters.map((chapter) => ({
        id: chapter.id,
        order: chapter.order,
      }))
      
      await chapterService.reorderChapters(novelId, chapterOrders)
    } catch (err) {
      // Revert optimistic update on error using stored original state
      setChapters(originalChapters)
      setError(err instanceof Error ? err.message : 'Failed to reorder chapters')
    } finally {
      setIsReordering(false)
    }
  }, [novelId, chapters])

  const createChapter = useCallback(async (title: string, content: string) => {
    if (!novelId) return null

    setIsLoading(true)
    setError(null)
    try {
      const newChapter = await chapterService.createChapter({
        novelId,
        title,
        content,
      })
      
      setChapters(prev => [...prev, newChapter])
      return newChapter
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chapter')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [novelId])

  const updateChapter = useCallback(async (chapterId: string, updates: { title?: string; content?: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedChapter = await chapterService.updateChapter(chapterId, updates)
      
      setChapters(prev => prev.map(chapter => 
        chapter.id === chapterId ? { ...chapter, ...updatedChapter } : chapter
      ))
      return updatedChapter
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update chapter')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteChapter = useCallback(async (chapterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await chapterService.deleteChapter(chapterId)
      
      setChapters(prev => {
        const filtered = prev.filter(chapter => chapter.id !== chapterId)
        // Re-index remaining chapters
        return filtered.map((chapter, index) => ({
          ...chapter,
          order: index
        }))
      })
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chapter')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getChapterByOrder = useCallback((order: number) => {
    return sortedChapters[order]
  }, [sortedChapters])

  const getChapterNumber = useCallback((chapterId: string) => {
    const index = sortedChapters.findIndex(chapter => chapter.id === chapterId)
    return index >= 0 ? index + 1 : null
  }, [sortedChapters])

  return {
    chapters: sortedChapters,
    isLoading,
    isReordering,
    error,
    loadChapters,
    reorderChapters,
    createChapter,
    updateChapter,
    deleteChapter,
    getChapterByOrder,
    getChapterNumber,
  }
}