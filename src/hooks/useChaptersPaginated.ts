"use client"

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import { Chapter } from '@/types/editor'

interface UseChaptersPaginatedOptions {
  novelSlug: string
  status?: 'draft' | 'published'
  pageSize?: number
  autoLoad?: boolean
}

interface UseChaptersPaginatedReturn {
  chapters: Chapter[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  currentPage: number
  totalChapters: number
  error: string | null
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  loadPage: (page: number) => Promise<void>
}

/**
 * Hook for handling large chapter lists with pagination and lazy loading
 * Optimized for novels with 1000+ chapters
 */
export function useChaptersPaginated({
  novelSlug,
  status,
  pageSize = 50,
  autoLoad = true,
}: UseChaptersPaginatedOptions): UseChaptersPaginatedReturn {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalChapters, setTotalChapters] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initial load
  useEffect(() => {
    if (autoLoad && novelSlug) {
      loadInitial()
    }
  }, [novelSlug, status, autoLoad])

  const loadInitial = async () => {
    setIsLoading(true)
    setError(null)
    setCurrentPage(1)
    setChapters([])
    
    try {
      const response = await api.getChapters(novelSlug, {
        page: 1,
        pageSize,
        status,
      })
      
      if (response.data) {
        setChapters(response.data)
        setTotalChapters(response.data.length)
        setHasMore(response.data.length === pageSize)
      }
    } catch (err) {
      console.error('Failed to load chapters:', err)
      setError('Failed to load chapters')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    
    setIsLoadingMore(true)
    setError(null)
    const nextPage = currentPage + 1
    
    try {
      const response = await api.getChapters(novelSlug, {
        page: nextPage,
        pageSize,
        status,
      })
      
      if (response.data) {
        setChapters(prev => [...prev, ...response.data!])
        setCurrentPage(nextPage)
        setTotalChapters(prev => prev + response.data!.length)
        setHasMore(response.data.length === pageSize)
      }
    } catch (err) {
      console.error('Failed to load more chapters:', err)
      setError('Failed to load more chapters')
    } finally {
      setIsLoadingMore(false)
    }
  }, [novelSlug, currentPage, pageSize, status, isLoadingMore, hasMore])

  const loadPage = useCallback(async (page: number) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getChapters(novelSlug, {
        page,
        pageSize,
        status,
      })
      
      if (response.data) {
        setChapters(response.data)
        setCurrentPage(page)
        setHasMore(response.data.length === pageSize)
      }
    } catch (err) {
      console.error('Failed to load page:', err)
      setError('Failed to load chapters')
    } finally {
      setIsLoading(false)
    }
  }, [novelSlug, pageSize, status])

  const refresh = useCallback(async () => {
    await loadInitial()
  }, [novelSlug, status, pageSize])

  return {
    chapters,
    isLoading,
    isLoadingMore,
    hasMore,
    currentPage,
    totalChapters,
    error,
    loadMore,
    refresh,
    loadPage,
  }
}
