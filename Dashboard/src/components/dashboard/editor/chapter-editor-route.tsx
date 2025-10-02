"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChapterEditor } from "@/components/dashboard/editor/chapter/chapter-editor"
import { Project, Chapter } from "@/types/editor"
import { recentProjects, chaptersData } from "@/data/editor-mock-data"

interface ChapterEditorRouteProps {
  novelSlug: string
  chapterId: string
}

export function ChapterEditorRoute({ novelSlug, chapterId }: ChapterEditorRouteProps) {
  const router = useRouter()
  const [novel, setNovel] = useState<Project | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [previewMode, setPreviewMode] = useState<"editor" | "reader">("editor")

  useEffect(() => {
    // Find the novel by slug
    const foundNovel = recentProjects.find(p => p.slug === novelSlug)
    if (foundNovel) {
      setNovel(foundNovel)
      
      // First try to find chapter in localStorage (for newly created chapters)
      // Only access localStorage on client-side
      let allChapters = chaptersData
      
      if (typeof window !== 'undefined') {
        const currentChaptersStr = localStorage.getItem('currentChapters')
        console.log('Raw localStorage chapters:', currentChaptersStr)
        if (currentChaptersStr) {
          try {
            const localChapters = JSON.parse(currentChaptersStr)
            console.log('Parsed chapters from localStorage:', localChapters.map(c => c.id))
            allChapters = localChapters
          } catch (error) {
            console.warn('Failed to parse chapters from localStorage:', error)
          }
        } else {
          console.log('No chapters found in localStorage')
        }
      }
      
      // Find the chapter by ID
      const foundChapter = allChapters.find(c => c.id === parseInt(chapterId))
      if (foundChapter) {
        setChapter(foundChapter)
      } else {
        // Chapter not found - redirect to novel management
        console.log('Chapter not found:', chapterId, 'in chapters:', allChapters.map(c => c.id))
        router.push(`/dashboard/editor/${novelSlug}`)
      }
    } else {
      // Novel not found - redirect to editor list
      router.push('/dashboard/editor')
    }
  }, [novelSlug, chapterId, router])

  const handleBack = () => {
    router.push(`/dashboard/editor/${novelSlug}`)
  }

  const handleSave = (updatedChapter: Chapter) => {
    setChapter(updatedChapter)
    // Here you would typically save to your backend/database
    console.log('Chapter saved:', updatedChapter)
  }

  if (!novel || !chapter) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            {!novel ? 'Novel not found' : 'Chapter not found'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {!novel 
              ? "The novel you're looking for doesn't exist." 
              : "The chapter you're looking for doesn't exist."
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <ChapterEditor
      chapter={chapter}
      novel={novel}
      onBack={handleBack}
      onSave={handleSave}
      previewMode={previewMode}
    />
  )
}
