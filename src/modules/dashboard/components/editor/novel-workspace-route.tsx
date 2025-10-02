"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NovelWorkspace } from "@/modules/dashboard/components/editor/novel/novel-workspace"
import { Project, Chapter } from "@/types/editor"
import { api } from "@/services/api"

interface NovelWorkspaceRouteProps {
  novelSlug: string
}

export function NovelWorkspaceRoute({ novelSlug }: NovelWorkspaceRouteProps) {
  const router = useRouter()
  const [novel, setNovel] = useState<Project | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [previewMode, setPreviewMode] = useState<"editor" | "reader">("editor")

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const myResp = await api.getMyNovels()
        const novels = Array.isArray(myResp.data) ? (myResp.data as Project[]) : []
        const found = novels.find((p) => p.slug === novelSlug)

        if (!found) {
          router.push('/dashboard/editor')
          return
        }

        if (!cancelled) {
          setNovel(found)
        }

        const chaptersResp = await api.getChapters(novelSlug)
        const chapterList = Array.isArray(chaptersResp.data)
          ? (chaptersResp.data as Chapter[])
          : []

        if (!cancelled) {
          setChapters(chapterList)
        }
      } catch (error) {
        router.push('/dashboard/editor')
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [novelSlug, router])

  // Refetch chapters when component becomes visible again (e.g., navigating back from chapter editor)
  useEffect(() => {
    const refetchChapters = async () => {
      try {
        const chaptersResp = await api.getChapters(novelSlug)
        const chapterList = Array.isArray(chaptersResp.data)
          ? (chaptersResp.data as Chapter[])
          : []
        setChapters(chapterList)
      } catch (error) {
        console.error("Failed to refetch chapters:", error)
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetchChapters()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', refetchChapters)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', refetchChapters)
    }
  }, [novelSlug])

  // Chapters now come from backend; no localStorage sync

  const handleBack = () => {
    router.push('/dashboard/editor')
  }

  const handleMarkAsCompleted = () => {
    if (novel) {
      // Update novel status to completed
      setNovel({ ...novel, status: "Completed" })
    }
  }

  const handleUpdateNovel = (updatedNovel: Project) => {
    setNovel(updatedNovel)
  }

  const handleSelectChapter = (chapterId: number) => {
    // Get the most current chapters from localStorage instead of state
    // because the state might not be updated yet
    if (typeof window !== 'undefined') {
      const currentChaptersStr = localStorage.getItem('currentChapters')
      if (currentChaptersStr) {
        try {
          const currentChapters = JSON.parse(currentChaptersStr)
          console.log('Navigation: Using chapters from localStorage:', currentChapters.map(c => c.id))
        } catch (error) {
          console.warn('Failed to parse chapters for navigation:', error)
        }
      }
    }
    router.push(`/dashboard/editor/${novelSlug}/${chapterId}`)
  }

  if (!novel) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">Novel not found</h2>
          <p className="text-sm text-muted-foreground mt-2">The novel you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <NovelWorkspace
      selectedNovel={novel}
      chapters={chapters}
      setChapters={setChapters}
      previewMode={previewMode}
      setPreviewMode={setPreviewMode}
      setSelectedChapter={handleSelectChapter}
      onBack={handleBack}
      onMarkAsCompleted={handleMarkAsCompleted}
      onUpdateNovel={handleUpdateNovel}
    />
  )
}
