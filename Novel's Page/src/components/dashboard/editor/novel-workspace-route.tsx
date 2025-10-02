"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NovelWorkspace } from "@/components/dashboard/editor/novel/novel-workspace"
import { Project, Chapter } from "@/types/editor"
import { recentProjects, chaptersData } from "@/data/editor-mock-data"

interface NovelWorkspaceRouteProps {
  novelSlug: string
}

export function NovelWorkspaceRoute({ novelSlug }: NovelWorkspaceRouteProps) {
  const router = useRouter()
  const [novel, setNovel] = useState<Project | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [previewMode, setPreviewMode] = useState<"editor" | "reader">("editor")

  useEffect(() => {
    // Find the novel by slug
    const foundNovel = recentProjects.find(p => p.slug === novelSlug)
    if (foundNovel) {
      setNovel(foundNovel)
      
      // Check if we have chapters in localStorage first, otherwise use default
      let initialChapters = chaptersData
      if (typeof window !== 'undefined') {
        const storedChapters = localStorage.getItem('currentChapters')
        console.log('Novel workspace loading, localStorage chapters:', storedChapters ? JSON.parse(storedChapters).map(c => c.id) : 'none')
        if (storedChapters) {
          try {
            initialChapters = JSON.parse(storedChapters)
            console.log('Using stored chapters, count:', initialChapters.length)
          } catch (error) {
            console.warn('Failed to parse stored chapters:', error)
          }
        } else {
          // Only store initial chapters if localStorage is empty
          console.log('No stored chapters, using default and storing in localStorage')
          localStorage.setItem('currentChapters', JSON.stringify(chaptersData))
        }
      }
      
      setChapters(initialChapters)
    } else {
      // Novel not found - redirect to editor list
      router.push('/dashboard/editor')
    }
  }, [novelSlug, router])

  // Update parent state when chapters change in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = () => {
        const storedChapters = localStorage.getItem('currentChapters')
        if (storedChapters) {
          try {
            const parsedChapters = JSON.parse(storedChapters)
            setChapters(parsedChapters)
            console.log('Parent state updated from localStorage:', parsedChapters.map(c => c.id))
          } catch (error) {
            console.warn('Failed to parse chapters on storage change:', error)
          }
        }
      }

      // Listen for storage events
      window.addEventListener('storage', handleStorageChange)
      
      // Also listen for custom events from child components
      window.addEventListener('chaptersUpdated', handleStorageChange)

      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('chaptersUpdated', handleStorageChange)
      }
    }
  }, [])

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
          <p className="text-sm text-muted-foreground mt-2">The novel you're looking for doesn't exist.</p>
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
