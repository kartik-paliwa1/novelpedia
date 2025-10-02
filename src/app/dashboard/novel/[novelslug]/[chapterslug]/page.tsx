"use client"

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import ChapterReader from '@/components/novel/chapter-reader'
import { api } from '@/services/api'
import type { Chapter } from '@/types/editor'

interface ChapterPageProps {
  params: {
    novelslug: string
    chapterslug: string
  }
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadChapter = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await api.getChapterBySlug(params.novelslug, params.chapterslug)
        if (!isMounted) return
        setChapter(response.data)
      } catch (err: any) {
        if (!isMounted) return
        setError(err?.message ?? 'Failed to load chapter')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadChapter()

    return () => {
      isMounted = false
    }
  }, [params.chapterslug, params.novelslug])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-semibold">We couldn’t load this chapter</h1>
          <p className="text-sm text-muted-foreground">{error ?? 'The requested chapter is unavailable.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <ChapterReader chapter={chapter} mode="reader" />
    </div>
  )
}
