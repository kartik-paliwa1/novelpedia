"use client"

import { useState } from "react"
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu'
import {
  ArrowLeft,
  Bold,
  ChevronDown,
  Eye,
  FileText,
  Italic,
  List,
  MoreHorizontal,
  Save,
  Settings,
  Type,
  Underline,
  Plus,
  GripVertical,
  Edit3,
  Trash2,
} from "lucide-react"

interface WritingEditorProps {
  project: {
    id: number
    title: string
    lastChapter: string
    lastEdited: string
    wordCount: number
    status: string
  }
  onBack: () => void
}

export function WritingEditor({ project, onBack }: WritingEditorProps) {
  const [chapterTitle, setChapterTitle] = useState("Chapter 18: New Beginnings")
  const [content, setContent] = useState(
    "The morning sun cast long shadows across the crystal plains as Elena stepped forward into her destiny. The ancient prophecy had spoken of this moment, when the chosen one would finally embrace their true power...",
  )
  const [wordCount, setWordCount] = useState(174)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold">{project.title}</h1>
            <p className="text-sm text-muted-foreground">{project.status}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{wordCount} words</span>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card/30 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Chapters</h3>
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs bg-transparent">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {Array.from({ length: 18 }, (_, i) => (
                  <div
                    key={i}
                    className={`group flex items-center justify-between p-2 rounded-md text-sm cursor-pointer transition-colors ${
                      i === 17 ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab" />
                      <span className="truncate">
                        Chapter {i + 1}: {i === 17 ? "New Beginnings" : `Chapter Title ${i + 1}`}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit3 className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Novel Settings</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Novel Info
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Novel
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Writing Tools</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Type className="h-4 w-4 mr-2" />
                  Character Notes
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Plot Outline
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  World Building
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-4 border-b bg-card/30 backdrop-blur-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Normal <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Normal</DropdownMenuItem>
                <DropdownMenuItem>Heading 1</DropdownMenuItem>
                <DropdownMenuItem>Heading 2</DropdownMenuItem>
                <DropdownMenuItem>Quote</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border" />

            <Button variant="outline" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Underline className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border" />

            <Button variant="outline" size="sm">
              <List className="h-4 w-4" />
            </Button>

            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Find & Replace</DropdownMenuItem>
                  <DropdownMenuItem>Word Count</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <Input
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="text-2xl font-bold border-none bg-transparent p-0 focus-visible:ring-0"
                placeholder="Chapter Title"
              />

              <Textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setWordCount(e.target.value.split(/\s+/).filter(Boolean).length)
                }}
                className="min-h-[600px] text-lg leading-relaxed border-none bg-transparent p-0 focus-visible:ring-0 resize-none"
                placeholder="Start writing your story..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 border-t bg-card/30 backdrop-blur-sm text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Auto-saved 2 minutes ago</span>
          <span>Line 1, Column 1</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>Reading time: ~1 min</span>
        </div>
      </div>
    </div>
  )
}
