"use client"

import { useMemo, useState } from "react"
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
import { AuthorNovelDraftPayload } from "@/services/api"
import { ALLOWED_TAG_NAMES } from "@/data/novel-taxonomy"

interface CreateNovelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (novelData: AuthorNovelDraftPayload) => void
}

export function CreateNovelDialog({ open, onOpenChange, onSave }: CreateNovelDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    contentType: "Original",
    language: "English",
    plannedLength: "Novel (40k+ words)",
    maturityRating: "General",
    genre: "",
  })
  const [tagSearch, setTagSearch] = useState("")

  const availableTags = ALLOWED_TAG_NAMES
  const filteredTags = useMemo(() => {
    const query = tagSearch.trim().toLowerCase()
    if (!query) {
      return availableTags
    }
    return availableTags.filter((tag) => tag.toLowerCase().includes(query))
  }, [availableTags, tagSearch])

  const addTag = (tag: string) => {
    if (!tag || selectedTags.includes(tag)) {
      return
    }
    if (selectedTags.length >= 6) {
      return
    }
    setSelectedTags([...selectedTags, tag])
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleCreate = () => {
    if (!formData.title.trim() || !formData.synopsis.trim()) {
      return // Basic validation
    }

    const novelData: AuthorNovelDraftPayload = {
      title: formData.title.trim(),
      synopsis: formData.synopsis.trim(),
      content_type: formData.contentType || undefined,
      language: formData.language || undefined,
      planned_length: formData.plannedLength || undefined,
      maturity_rating: formData.maturityRating || undefined,
      status: 'Ongoing',
      // TODO: Add genre and tag mappings when backend supports them
    }

    if (onSave) {
      onSave(novelData)
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="gradient-heading">Create New Novel</DialogTitle>
          <DialogDescription>Fill in the details to create your new novel project.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Novel Title *</Label>
                <Input 
                  id="title" 
                  placeholder="Enter your novel title" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Primary Genre *</Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
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
                <Label htmlFor="content-type">Content Type</Label>
                <Select value={formData.contentType} onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Original">Original</SelectItem>
                    <SelectItem value="Fanfic">Fanfic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Book Cover</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG or JPG, 800x600px, max 5MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Synopsis *</Label>
            <Textarea
              id="description"
              placeholder="Write a compelling synopsis that will attract readers..."
              className="min-h-[100px]"
              value={formData.synopsis}
              onChange={(e) => setFormData(prev => ({ ...prev, synopsis: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (up to 6)</Label>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const trimmed = newTag.trim()
                    addTag(trimmed)
                    setNewTag("")
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const trimmed = newTag.trim()
                  addTag(trimmed)
                  setNewTag("")
                }}
              >
                Add
              </Button>
            </div>
            <Input
              className="mt-2"
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(event) => setTagSearch(event.target.value)}
            />
            <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-dashed border-muted-foreground/40 p-2">
              {filteredTags.length === 0 ? (
                <span className="text-xs text-muted-foreground">No tags match your search.</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {filteredTags.map((tag) => (
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
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planned-length">Planned Length</Label>
              <Select value={formData.plannedLength} onValueChange={(value) => setFormData(prev => ({ ...prev, plannedLength: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short Story (< 10,000 words)">
                    Short Story (&lt; 10,000 words)
                  </SelectItem>
                  <SelectItem value="Novella (10,000 - 40,000 words)">
                    Novella (10,000 - 40,000 words)
                  </SelectItem>
                  <SelectItem value="Novel (40k+ words)">
                    Novel (40k+ words)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maturity-rating">Maturity Rating</Label>
              <Select value={formData.maturityRating} onValueChange={(value) => setFormData(prev => ({ ...prev, maturityRating: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select maturity rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="PG-13">PG-13</SelectItem>
                  <SelectItem value="Adult">Adult</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Novel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
