"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, BookOpen, Calendar } from "lucide-react"

import { StatusBadge } from "@/components/dashboard/ui/status-badge"
import { Card, CardContent } from "@/components/dashboard/ui/card"
import { Button } from "@/components/dashboard/ui/button"
import type { Chapter, Project } from "@/types/editor"
import { api } from "@/services/api"

interface NovelDetailPageProps {
  params: { novelslug: string }
}

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return value
}

export default function NovelDetailPage({ params }: NovelDetailPageProps) {
  const slug = decodeURIComponent(params.novelslug)
  const [novel, setNovel] = useState<Project | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadNovel = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const novelsResponse = await api.getMyNovels()
        const novelList = Array.isArray(novelsResponse.data) ? (novelsResponse.data as Project[]) : []
        const foundNovel = novelList.find((candidate) => candidate.slug === slug || String(candidate.id) === slug)

        if (!foundNovel) {
          if (!cancelled) {
            setError("We couldn't find that novel.")
          }
          return
        }

        if (!cancelled) {
          setNovel(foundNovel)
        }

  const chaptersResponse = await api.getChapters(foundNovel.slug ?? String(foundNovel.id ?? slug))
        const chapterList = Array.isArray(chaptersResponse.data) ? (chaptersResponse.data as Chapter[]) : []

        const sortedChapters = chapterList.slice().sort((a, b) => a.order - b.order)

        if (!cancelled) {
          setChapters(sortedChapters)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Failed to load novel details.")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadNovel()

    return () => {
      cancelled = true
    }
  }, [slug])

  const publishedChapters = useMemo(
    () => chapters.filter((chapter) => chapter.status === "published"),
    [chapters]
  )

  const draftChapters = useMemo(
    () => chapters.filter((chapter) => chapter.status === "draft"),
    [chapters]
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading novel…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button asChild variant="link" className="mt-4 text-primary">
          <Link href="/dashboard/editor">Return to your studio</Link>
        </Button>
      </div>
    )
  }

  if (!novel) {
    return null
  }

  const resolvedNovelSlug = novel.slug ?? slug

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard/editor" className="transition hover:text-primary">
            ← Back to Writing Studio
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{novel.title}</h1>
            <StatusBadge status={novel.status} />
            {novel.lastUpdated && (
              <span className="text-sm text-muted-foreground">
                Last updated {formatDate(novel.lastUpdated)}
              </span>
            )}
          </div>
          {novel.description && (
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              {novel.description}
            </p>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Published chapters</h2>
          <p className="text-sm text-muted-foreground">
            Chapters listed here are live for readers. Drafts stay hidden until you publish them.
          </p>
        </div>

        {publishedChapters.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No chapters published yet. Publish a draft from the editor to make it visible here.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {publishedChapters.map((chapter) => {
              const publishedLabel = formatDate(chapter.publishedAt) ?? "Recently published"
              const novelSlug = novel.slug ?? slug
              const chapterHref = chapter.slug
                ? `/dashboard/novel/${resolvedNovelSlug}/${chapter.slug}`
                : `/dashboard/editor/${resolvedNovelSlug}/${chapter.id}`

              return (
                <Card key={chapter.id}>
                  <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">
                          Chapter {chapter.order}: {chapter.title}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5" />
                          {chapter.wordCount.toLocaleString()} words
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          Published {publishedLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild size="sm">
                        <Link href={chapterHref}>View chapter</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {draftChapters.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-muted-foreground">Drafts (not visible to readers)</h2>
            <p className="text-sm text-muted-foreground">
              Publish these chapters from the editor when they’re ready to share.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {draftChapters.map((chapter) => (
              <Card key={chapter.id} className="border-dashed">
                <CardContent className="space-y-2 p-4">
                  <div className="font-medium">Chapter {chapter.order}: {chapter.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {chapter.wordCount.toLocaleString()} words
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/editor/${resolvedNovelSlug}/${chapter.id}`}>Continue editing</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
