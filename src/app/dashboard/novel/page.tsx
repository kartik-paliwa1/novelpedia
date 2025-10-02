"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'

import ChapterReader from '@/components/novel/chapter-reader'
import { api } from '@/services/api'
import { Chapter, Project } from '@/types/editor'

interface ChapterCache {
  [novelSlug: string]: Chapter[]
}

export default function NovelPage() {
  const [novels, setNovels] = useState<Project[]>([])
  const [selectedNovel, setSelectedNovel] = useState<Project | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [chaptersCache, setChaptersCache] = useState<ChapterCache>({})
  const [isLoadingNovels, setIsLoadingNovels] = useState(true)
  const [isLoadingChapter, setIsLoadingChapter] = useState(false)
  const [novelError, setNovelError] = useState<string | null>(null)
  const [chapterError, setChapterError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadNovels = async () => {
      try {
        setIsLoadingNovels(true)
        const response = await api.getNovels()
        if (!isMounted) return

        const data = Array.isArray(response.data) ? response.data : []
        setNovels(data)
        if (data.length > 0) {
          setSelectedNovel(data[0])
        }
      } catch (error: any) {
        if (!isMounted) return
        setNovelError(error?.message ?? 'Failed to load novels')
      } finally {
        if (isMounted) {
          setIsLoadingNovels(false)
        }
      }
    }

    loadNovels()

    return () => {
      isMounted = false
    }
  }, [])

  const loadChapters = useCallback(
    async (novel: Project) => {
      if (!novel?.slug) {
        return
      }

      if (chaptersCache[novel.slug]) {
        return
      }

      try {
        setIsLoadingChapter(true)
        setChapterError(null)
        const response = await api.getChapters(novel.slug)
        const chapters = Array.isArray(response.data) ? response.data : []
        setChaptersCache((prev) => ({
          ...prev,
          [novel.slug]: chapters,
        }))
      } catch (error: any) {
        setChapterError(error?.message ?? 'Failed to load chapters')
      } finally {
        setIsLoadingChapter(false)
      }
    },
    [chaptersCache]
  )

  useEffect(() => {
    if (selectedNovel) {
      loadChapters(selectedNovel)
    }
  }, [loadChapters, selectedNovel])

  const handleSelectNovel = async (novel: Project) => {
    setSelectedNovel(novel)
    setSelectedChapter(null)
    await loadChapters(novel)
  }

  const handleSelectChapter = async (chapter: Chapter, novel: Project) => {
    setIsLoadingChapter(true)
    setChapterError(null)

    try {
      if (chapter.content) {
        setSelectedChapter(chapter)
        return
      }

      const response = await api.getChapterById(chapter.id)
      setSelectedChapter(response.data)
      setChaptersCache((prev) => ({
        ...prev,
        [novel.slug]: (prev[novel.slug] || []).map((item) =>
          item.id === chapter.id ? response.data : item
        ),
      }))
    } catch (error: any) {
      setChapterError(error?.message ?? 'Failed to load chapter content')
    } finally {
      setIsLoadingChapter(false)
    }
  }

  const chaptersForNovel = useMemo(() => {
    if (!selectedNovel?.slug) {
      return []
    }

    return chaptersCache[selectedNovel.slug] ?? []
  }, [chaptersCache, selectedNovel?.slug])

  if (isLoadingNovels) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-600">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    )
  }

  if (novelError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-600 p-8">
        <div className="max-w-lg rounded-2xl bg-white/10 p-6 text-center text-white shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Unable to load your novels</h2>
          <p className="text-sm text-white/80 mb-6">{novelError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded bg-fuchsia-700 hover:bg-fuchsia-800 transition font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!selectedNovel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-600 p-8 text-center text-white">
        <div className="space-y-4 max-w-xl">
          <h1 className="text-4xl font-bold">Create your first novel</h1>
          <p className="text-white/80">
            It looks like you have not started any novels yet. Visit the editor to begin crafting your first story.
          </p>
        </div>
      </div>
    )
  }

  if (selectedChapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-600 p-8 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-l from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-30"></div>
          <div className="absolute left-0 top-1/2 w-1/4 h-24 bg-gradient-to-b from-purple-400 to-transparent blur-2xl opacity-20"></div>
        </div>
        <button
          onClick={() => setSelectedChapter(null)}
          className="mb-6 px-4 py-2 bg-fuchsia-700 text-white rounded shadow hover:bg-fuchsia-800 transition font-bold"
        >
          ← Back to Chapters
        </button>
        <div className="w-full max-w-2xl">
          <ChapterReader
            chapter={selectedChapter}
            mode="reader"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-600 p-8 flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-l from-fuchsia-400 via-purple-400 to-indigo-400 blur-2xl opacity-30"></div>
        <div className="absolute left-0 top-1/2 w-1/4 h-24 bg-gradient-to-b from-purple-400 to-transparent blur-2xl opacity-20"></div>
      </div>
      <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow-xl tracking-wide font-serif">Your Novels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {novels.map((novel) => (
          <div
            key={novel.id}
            className={`bg-gradient-to-br from-purple-700 via-fuchsia-700 to-indigo-800 border-2 border-fuchsia-400 rounded-2xl p-6 shadow-2xl cursor-pointer transition flex flex-col justify-between relative ${
              selectedNovel?.id === novel.id ? 'ring-2 ring-fuchsia-300' : 'hover:scale-105 hover:shadow-fuchsia-500/40'
            }`}
            onClick={() => handleSelectNovel(novel)}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-fuchsia-400 rounded-full blur-2xl opacity-30"></div>
            <h2 className="text-2xl font-extrabold text-white mb-2 drop-shadow-lg font-serif">{novel.title}</h2>
            <p className="text-white/90 mb-4 italic font-light line-clamp-3">{novel.description}</p>
            <span className="text-xs font-semibold text-fuchsia-200 bg-fuchsia-700 bg-opacity-60 px-2 py-1 rounded-full shadow">
              Status: {novel.status}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl bg-gradient-to-br from-purple-800 via-fuchsia-700 to-indigo-900 rounded-2xl shadow-2xl mt-12 p-8 border-2 border-fuchsia-400">
        <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg font-serif">{selectedNovel.title}</h2>
        <p className="text-white/90 italic mb-6 font-light">{selectedNovel.description}</p>
        <h3 className="text-xl font-bold text-fuchsia-200 mb-4">Chapters</h3>
        {chapterError && <p className="text-sm text-red-200 mb-2">{chapterError}</p>}
        {isLoadingChapter ? (
          <div className="flex items-center gap-2 text-fuchsia-100">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading chapters…</span>
          </div>
        ) : (
          <ul className="space-y-3">
            {chaptersForNovel.length > 0 ? (
              chaptersForNovel.map((chapter) => (
                <li key={chapter.id}>
                  <button
                    onClick={() => handleSelectChapter(chapter, selectedNovel)}
                    className="w-full text-left px-4 py-2 rounded bg-fuchsia-700 bg-opacity-80 text-white font-semibold shadow hover:bg-fuchsia-800 transition border border-fuchsia-400"
                  >
                    {chapter.title}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-sm text-fuchsia-100">No chapters found for this novel yet.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
