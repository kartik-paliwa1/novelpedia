"use client"

import { Button } from "@/components/dashboard/ui/button"
import { Card, CardContent } from "@/components/dashboard/ui/card"
import { ArrowLeft, BookOpen, Calendar, Edit3 } from "lucide-react"
import { StatusBadge } from "@/components/dashboard/ui/status-badge"

interface ChapterReaderProps {
  novel: {
    title: string
    genre: string
    status: string
  }
  chapter: {
    id: number
    title: string
    wordCount: number
    publishedAt: string | null
  }
  onBack: () => void
  previewMode?: "editor" | "reader"
}

export function ChapterReader({ novel, chapter, onBack, previewMode = "editor" }: ChapterReaderProps) {
  const sampleContent = `The morning sun cast long shadows across the crystal plains as Elena stepped forward into her destiny. The ancient prophecy had spoken of this moment, when the chosen one would finally embrace their true power.

She could feel the energy coursing through her veins, a warm tingling sensation that seemed to connect her to every living thing around her. The crystals embedded in the ground beneath her feet pulsed with a soft, ethereal light, responding to her presence.

"Are you ready?" asked Marcus, her mentor and guide throughout this incredible journey. His weathered face showed both pride and concern as he watched his student prepare for what lay ahead.

Elena nodded, her determination unwavering despite the magnitude of what she was about to attempt. The fate of their world hung in the balance, and she was the only one who could tip the scales toward salvation.

As she raised her hands, the crystals began to sing—a haunting melody that seemed to come from the very heart of the earth itself. The power was intoxicating, overwhelming, but she held firm to her purpose.

This was her moment. This was her destiny.

The light grew brighter, and Elena felt herself becoming one with the ancient magic that had slumbered for centuries. She was no longer just a young woman from a small village; she was the bridge between worlds, the key to unlocking a future filled with hope.

And as the transformation began, she smiled, knowing that everything she had endured had led to this perfect, crystalline moment of truth.`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{novel.title}</h1>
          <p className="text-sm text-muted-foreground">{novel.genre}</p>
        </div>

        {/* Preview Mode Indicator */}
        {previewMode && (
          <div className="flex items-center gap-2">
            <StatusBadge 
              status={previewMode === "reader" ? "Published" : "Draft"} 
              className="text-xs"
            />
            {novel.status === "Draft" && (
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
                  <span>{chapter.wordCount} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {chapter.publishedAt ? `Published ${chapter.publishedAt}` : "Not yet published"}
                  </span>
                </div>
              </div>
            </div>

            {/* Chapter Text */}
            <div className={`prose max-w-none ${previewMode === "reader" ? "prose-lg" : ""}`}>
              {sampleContent.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className={`mb-4 leading-relaxed text-foreground ${previewMode === "reader" ? "text-lg" : ""}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

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
