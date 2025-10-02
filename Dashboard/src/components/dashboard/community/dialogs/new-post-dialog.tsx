// Create new post dialog
"use client"

import { useState } from "react"
import { Button } from "@/components/dashboard/ui/button"
import { Input } from "@/components/dashboard/ui/input"
import { Textarea } from "@/components/dashboard/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog"
import { Plus } from "lucide-react"
import { Category, NewPostData } from "@/types/community"

interface NewPostDialogProps {
  categories: Category[]
  onSubmit?: (data: NewPostData) => void
  onSaveDraft?: (data: NewPostData) => void
}

export function NewPostDialog({ categories, onSubmit, onSaveDraft }: NewPostDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    const postData: NewPostData = {
      title,
      content,
      category,
    }
    onSubmit?.(postData)
    resetForm()
    setIsOpen(false)
  }

  const handleSaveDraft = () => {
    const postData: NewPostData = {
      title,
      content,
      category,
    }
    onSaveDraft?.(postData)
    resetForm()
    setIsOpen(false)
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setCategory("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or start a discussion with the community.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="What's your post about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              placeholder="Share your thoughts..."
              className="min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !content || !category}>
            Post to Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
