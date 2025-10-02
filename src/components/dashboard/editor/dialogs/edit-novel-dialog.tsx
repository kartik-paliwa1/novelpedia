"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/dashboard/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog"
import { Input } from "@/components/dashboard/ui/input"
import { Label } from "@/components/dashboard/ui/label"
import { Textarea } from "@/components/dashboard/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/ui/select"
import { Badge } from "@/components/dashboard/ui/badge"
import { Upload, X } from "lucide-react"
import { Novel } from "@/types/editor"

interface EditNovelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  novel: Novel
  onSave: (updatedNovel: Novel) => void
}

export function EditNovelDialog({ open, onOpenChange, novel, onSave }: EditNovelDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    targetAudience: "general",
    language: "english",
    plannedLength: "novel",
    updateSchedule: "weekly",
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const availableTags = [
    "Fantasy",
    "Romance",
    "Sci-Fi",
    "Mystery",
    "Adventure",
    "Drama",
    "Comedy",
    "Horror",
    "Thriller",
    "Historical",
    "Magic",
    "Coming of Age",
    "Cyberpunk",
    "Technology",
    "Music",
    "Contemporary",
  ]

  // Initialize form with novel data
  useEffect(() => {
    if (novel && open) {
      setFormData({
        title: novel.title,
        genre: novel.genre.toLowerCase(),
        description: novel.description,
        targetAudience: "general",
        language: "english",
        plannedLength: "novel",
        updateSchedule: "weekly",
      })
      setSelectedTags(novel.tags)
    }
  }, [novel, open])

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    }
    setNewTag("")
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleSave = () => {
    const updatedNovel: Novel = {
      ...novel,
      ...formData,
      tags: selectedTags,
    }
    onSave(updatedNovel)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="gradient-heading">Edit Novel Settings</DialogTitle>
          <DialogDescription>Update your novel&#39;s information and settings.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Novel Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter your novel title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-genre">Primary Genre *</Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="sci-fi">Science Fiction</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-target-audience">Target Audience</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Audience</SelectItem>
                    <SelectItem value="young-adult">Young Adult</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="teen">Teen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Book Cover</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="aspect-[3/4] w-32 mx-auto rounded-lg overflow-hidden mb-4">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${novel.cover})` }}
                    />
                  </div>
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to change cover image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Synopsis *</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write a compelling synopsis that will attract readers..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (up to 5)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(newTag)
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addTag(newTag)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {availableTags
                .filter((tag) => !selectedTags.includes(tag))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-planned-length">Planned Length</Label>
              <Select
                value={formData.plannedLength}
                onValueChange={(value) => setFormData({ ...formData, plannedLength: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short Story (&lt; 10,000 words)</SelectItem>
                  <SelectItem value="novella">Novella (10,000 - 40,000 words)</SelectItem>
                  <SelectItem value="novel">Novel (40,000 - 100,000 words)</SelectItem>
                  <SelectItem value="epic">Epic Novel (100,000+ words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-update-schedule">Update Schedule</Label>
              <Select
                value={formData.updateSchedule}
                onValueChange={(value) => setFormData({ ...formData, updateSchedule: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="irregular">Irregular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}