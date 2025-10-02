"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NovelWorkspace } from "@/components/dashboard/editor/novel/novel-workspace"
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
  const [isLoadingChapters, setIsLoadingChapters] = useState(false)

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

        if (!cancelled) {
          setIsLoadingChapters(true)
        }

        const chaptersResp = await api.getChapters(novelSlug)
        const chapterList = Array.isArray(chaptersResp.data)
          ? (chaptersResp.data as Chapter[])
          : []

        if (!cancelled) {
          setChapters(chapterList)
          setIsLoadingChapters(false)
        }
      } catch (error) {
        if (!cancelled) {
          setIsLoadingChapters(false)
        }
        router.push('/dashboard/editor')
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [novelSlug, router])

  // Reload chapters from API when they are updated
  const reloadChapters = async () => {
    try {
      setIsLoadingChapters(true)
      const chaptersResp = await api.getChapters(novelSlug)
      const chapterList = Array.isArray(chaptersResp.data)
        ? (chaptersResp.data as Chapter[])
        : []
      setChapters(chapterList)
    } catch (error) {
      console.error('Failed to reload chapters:', error)
      // Don't show error for automatic reloads to avoid spam
    } finally {
      setIsLoadingChapters(false)
    }
  }

  // Custom setChapters function that also syncs with backend
  const updateChapters = (newChapters: Chapter[]) => {
    setChapters(newChapters)
    // Trigger a reload after a short delay to ensure backend consistency
    setTimeout(() => reloadChapters(), 500)
  }

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
    router.push(`/dashboard/editor/${novelSlug}/${chapterId}`)
  }

  if (!novel) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            {isLoadingChapters ? 'Loading...' : 'Novel not found'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {isLoadingChapters 
              ? 'Please wait while we load your novel...'
              : "The novel you're looking for doesn't exist."
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <NovelWorkspace
      selectedNovel={novel}
      chapters={chapters}
      setChapters={updateChapters}
      previewMode={previewMode}
      setPreviewMode={setPreviewMode}
      setSelectedChapter={handleSelectChapter}
      onBack={handleBack}
      onMarkAsCompleted={handleMarkAsCompleted}
      onUpdateNovel={handleUpdateNovel}
    />
  )
}
