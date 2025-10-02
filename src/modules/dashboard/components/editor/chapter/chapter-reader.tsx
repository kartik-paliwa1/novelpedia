"use client"

import { useMemo } from "react"
import { ArrowLeft, BookOpen, Calendar, Edit3 } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Card, CardContent } from "@/common/components/ui/card"
import { StatusBadge } from "@/common/components/ui/status-badge"

interface ChapterReaderProps {
  novel?: {
    title: string
    genre?: string
    status?: string
  }
  chapter: {
    id: number | string
    title: string
    wordCount?: number | null
    publishedAt?: string | null
    content?: string | null
  }
  onBack: () => void
  previewMode?: "editor" | "reader"
}

export function ChapterReader({ novel, chapter, onBack, previewMode = "editor" }: ChapterReaderProps) {
  const publishedDate = useMemo(() => {
    if (!chapter.publishedAt) {
      return null
    }

    const parsed = new Date(chapter.publishedAt)
    if (Number.isNaN(parsed.getTime())) {
      return chapter.publishedAt
    }

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(parsed)
  }, [chapter.publishedAt])

  const chapterContent = useMemo(() => {
    if (!chapter?.content) {
      return []
    }

    if (/<[a-z][\s\S]*>/i.test(chapter.content)) {
      return chapter.content
    }

    return chapter.content
      .split("\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  }, [chapter?.content])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{novel?.title ?? "Untitled Novel"}</h1>
          {novel?.genre && <p className="text-sm text-muted-foreground">{novel.genre}</p>}
        </div>

        {/* Preview Mode Indicator */}
        {previewMode && (
          <div className="flex items-center gap-2">
            <StatusBadge
              status={previewMode === "reader" ? "Completed" : "Draft"}
              className="text-xs"
            />
            {novel?.status === "Draft" && (
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Edit3 className="h-4 w-4" />
                Edit Chapter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Chapter Content */}
      <Card className="neumorphic">
        <CardContent className={previewMode === "reader" ? "p-8" : "p-6"}>
          <div className={`mx-auto space-y-6 ${previewMode === "reader" ? "max-w-4xl" : "max-w-5xl"}`}>
            {/* Chapter Header */}
            <div className={`space-y-2 pb-6 border-b ${previewMode === "reader" ? "text-center" : ""}`}>
              <h2 className={`font-bold ${previewMode === "reader" ? "text-3xl" : "text-2xl"}`}>
                Chapter {chapter.id}: {chapter.title}
              </h2>
              <div
                className={`flex items-center gap-4 text-sm text-muted-foreground ${previewMode === "reader" ? "justify-center" : ""}`}
              >
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{chapter.wordCount ?? 0} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{publishedDate ? `Published ${publishedDate}` : "Draft"}</span>
                </div>
              </div>
            </div>

            {/* Chapter Text */}
            {Array.isArray(chapterContent) ? (
              <div className={`prose max-w-none ${previewMode === "reader" ? "prose-lg" : ""}`}>
                {chapterContent.length > 0 ? (
                  chapterContent.map((paragraph, index) => (
                    <p
                      key={`${paragraph}-${index}`}
                      className={`mb-4 leading-relaxed text-foreground ${previewMode === "reader" ? "text-lg" : ""}`}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">This chapter does not have any content yet.</p>
                )}
              </div>
            ) : (
              <div
                className={`prose max-w-none ${previewMode === "reader" ? "prose-lg" : ""}`}
                dangerouslySetInnerHTML={{
                  __html:
                    chapterContent ||
                    "<p class='text-muted-foreground italic'>This chapter does not have any content yet.</p>",
                }}
              />
            )}

            {/* Reader View Footer */}
            {previewMode === "reader" && (
              <div className="pt-8 border-t text-center space-y-4">
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span>End of Chapter {chapter.id}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm">
                    Previous Chapter
                  </Button>
                  <Button size="sm">Next Chapter</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
