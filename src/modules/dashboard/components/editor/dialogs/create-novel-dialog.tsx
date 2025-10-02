"use client"

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/common/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog"
import { Input } from "@/common/components/ui/input"
import { Label } from "@/common/components/ui/label"
import { Textarea } from "@/common/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select"
import { Badge } from "@/common/components/ui/badge"
import { Loader2, Upload, X } from "lucide-react"
import { NovelFormData } from "@/types/editor"
import { api, Genre, Tag } from "@/services/api"
import { cn } from "@/utils/utils"
import { ALLOWED_GENRE_NAMES, ALLOWED_TAG_NAMES } from "@/data/novel-taxonomy"
import toast from "react-hot-toast"

interface CreateNovelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (novelData: NovelFormData) => Promise<void> | void
}

const CREATION_STEPS = [
  { key: "basics", label: "Basics" },
  { key: "categories", label: "Categories" },
  { key: "publishing", label: "Publishing" },
] as const

const MAX_TAGS = 6
const MAX_SUPPORTING_GENRES = 1
const DEFAULT_CONTENT_TYPE = "Original"
const DEFAULT_LANGUAGE = "English"
const DEFAULT_PLANNED_LENGTH = "Novel (40k+ words)"
const DEFAULT_MATURITY_RATING = "General"

const GENRE_ORDER_LOOKUP = (() => {
  const map = new Map<string, number>();
  ALLOWED_GENRE_NAMES.forEach((name, index) => {
    map.set(name.toLowerCase(), index);
  });
  return map;
})();

const ALLOWED_GENRE_NAME_SET = new Set<string>(Array.from(GENRE_ORDER_LOOKUP.keys()));

const TAG_ORDER_LOOKUP = (() => {
  const map = new Map<string, number>();
  ALLOWED_TAG_NAMES.forEach((name, index) => {
    const key = name.toLowerCase();
    if (!map.has(key)) {
      map.set(key, index);
    }
  });
  return map;
})();

const ALLOWED_TAG_NAME_SET = new Set<string>(Array.from(TAG_ORDER_LOOKUP.keys()));

export function CreateNovelDialog({ open, onOpenChange, onSave }: CreateNovelDialogProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [primaryGenreId, setPrimaryGenreId] = useState<number | null>(null)
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([])
  const [supportingGenreSelectValue, setSupportingGenreSelectValue] = useState("")
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [customTagName, setCustomTagName] = useState("")
  const [contentType, setContentType] = useState(DEFAULT_CONTENT_TYPE)
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const [plannedLength, setPlannedLength] = useState(DEFAULT_PLANNED_LENGTH)
  const [maturityRating, setMaturityRating] = useState(DEFAULT_MATURITY_RATING)
  const [tagSearch, setTagSearch] = useState("")
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [isCreatingTag, setIsCreatingTag] = useState(false)
  const [optionError, setOptionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverPreview, setCoverPreview] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const filteredTags = useMemo(() => {
    const normalizedQuery = tagSearch.trim().toLowerCase();
    if (!normalizedQuery) {
      return availableTags;
    }
    return availableTags.filter((tag) => tag.name.toLowerCase().includes(normalizedQuery));
  }, [availableTags, tagSearch])

  const selectedTags = useMemo(
    () => availableTags.filter((tag) => selectedTagIds.includes(tag.id)),
    [availableTags, selectedTagIds]
  )

  const supportingGenres = useMemo(
    () =>
      availableGenres.filter(
        (genre) => genre.id !== primaryGenreId && selectedGenreIds.includes(genre.id)
      ),
    [availableGenres, primaryGenreId, selectedGenreIds]
  )

  const hasBasicsFilled = title.trim().length >= 3 && description.trim().length >= 30
  const hasCategoriesSelected = primaryGenreId !== null && selectedGenreIds.length === 1
  const canProceed = activeStep === 0 ? hasBasicsFilled : activeStep === 1 ? hasCategoriesSelected : true
  const isLastStep = activeStep === CREATION_STEPS.length - 1
  const canSubmit = hasBasicsFilled && hasCategoriesSelected

  const primaryActionLabel = isLastStep ? (isSubmitting ? "Creating..." : "Create Novel") : "Continue"
  const secondaryActionLabel = activeStep === 0 ? "Cancel" : "Back"

  const primaryActionDisabled = isLastStep
    ? isSubmitting || !canSubmit
    : !canProceed || isLoadingOptions

  const primaryGenre = useMemo(
    () => availableGenres.find((genre) => genre.id === primaryGenreId) ?? null,
    [availableGenres, primaryGenreId]
  )

  const loadOptions = async () => {
    setIsLoadingOptions(true)
    setOptionError(null)
    try {
      const [genresResponse, tagsResponse] = await Promise.all([
        api.getGenres({ ordering: "name" }),
        api.getTags({ ordering: "name" }),
      ])

      const rawGenres = Array.isArray(genresResponse.data)
        ? (genresResponse.data as Genre[])
        : []
      const genreMap = new Map<string, Genre>()
      rawGenres.forEach((genre) => {
        const key = typeof genre?.name === "string" ? genre.name.toLowerCase() : ""
        if (!key || !ALLOWED_GENRE_NAME_SET.has(key) || genreMap.has(key)) {
          return
        }
        genreMap.set(key, genre)
      })
      const orderedGenres = Array.from(genreMap.values()).sort((a, b) => {
        const orderA = GENRE_ORDER_LOOKUP.get((a.name ?? "").toLowerCase()) ?? Number.MAX_SAFE_INTEGER
        const orderB = GENRE_ORDER_LOOKUP.get((b.name ?? "").toLowerCase()) ?? Number.MAX_SAFE_INTEGER
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return (a.name ?? "").localeCompare(b.name ?? "")
      })

      const rawTags = Array.isArray(tagsResponse.data) ? (tagsResponse.data as Tag[]) : []
      const tagMap = new Map<string, Tag>()
      rawTags.forEach((tag) => {
        const key = typeof tag?.name === "string" ? tag.name.toLowerCase() : ""
        if (!key || !ALLOWED_TAG_NAME_SET.has(key) || tagMap.has(key)) {
          return
        }
        tagMap.set(key, tag)
      })
      const orderedTags = Array.from(tagMap.values()).sort((a, b) => {
        const orderA = TAG_ORDER_LOOKUP.get((a.name ?? "").toLowerCase()) ?? Number.MAX_SAFE_INTEGER
        const orderB = TAG_ORDER_LOOKUP.get((b.name ?? "").toLowerCase()) ?? Number.MAX_SAFE_INTEGER
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return (a.name ?? "").localeCompare(b.name ?? "")
      })

      setAvailableGenres(orderedGenres)
      setAvailableTags(orderedTags)
    } catch (error) {
      console.error("Failed to load novel metadata options", error)
      setOptionError("We couldn't load genres and tags right now. Please try again soon.")
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const resetCover = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverPreview("")
    setCoverFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setShortDescription("")
    setPrimaryGenreId(null)
    setSelectedGenreIds([])
    setSupportingGenreSelectValue("")
    setSelectedTagIds([])
    setCustomTagName("")
    setContentType(DEFAULT_CONTENT_TYPE)
    setLanguage(DEFAULT_LANGUAGE)
    setPlannedLength(DEFAULT_PLANNED_LENGTH)
    setMaturityRating(DEFAULT_MATURITY_RATING)
    setTagSearch("")
    resetCover()
    setActiveStep(0)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm()
    }
    onOpenChange(nextOpen)
  }

  useEffect(() => {
    if (open) {
      setActiveStep(0)
      loadOptions()
    }
  }, [open])

  useEffect(() => {
    if (!primaryGenreId) {
      return
    }
    setSelectedGenreIds((prev) => prev.filter((genreId) => genreId !== primaryGenreId))
  }, [primaryGenreId])

  const handleCoverSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const fileType = file.type.toLowerCase()
    const isSupportedType = fileType === "image/png" || fileType === "image/jpeg"
    if (!isSupportedType) {
      toast.error("Cover must be a PNG or JPG file.")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover images must be 5MB or smaller.")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    const previewUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      if (image.width !== 800 || image.height !== 600) {
        toast.error("Cover must be exactly 800x600 pixels.")
        URL.revokeObjectURL(previewUrl)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        return
      }

      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
      setCoverPreview(previewUrl)
      setCoverFile(file)
    }
    image.onerror = () => {
      toast.error("We couldn't read that image. Please try again.")
      URL.revokeObjectURL(previewUrl)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
    image.src = previewUrl
  }

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId)
      }

      if (prev.length >= MAX_TAGS) {
        toast.error(`You can pick up to ${MAX_TAGS} tags.`)
        return prev
      }

      return [...prev, tagId]
    })
  }

  const toggleSupportingGenre = (genreId: number) => {
    setSelectedGenreIds((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId)
      }
      return [genreId]
    })
  }

  const handleCreateCustomTag = async () => {
    const trimmed = customTagName.trim()
    if (!trimmed) {
      toast.error("Enter a tag name first.")
      return
    }

    const existingTag = availableTags.find(
      (tag) => tag.name.toLowerCase() === trimmed.toLowerCase()
    )

    if (existingTag) {
      toggleTag(existingTag.id)
      setCustomTagName("")
      return
    }

    if (selectedTagIds.length >= MAX_TAGS) {
      toast.error(`You can pick up to ${MAX_TAGS} tags.`)
      return
    }

    try {
      setIsCreatingTag(true)
      const response = await api.createTag({ name: trimmed })
      const created = response.data
      setAvailableTags((prev) => [...prev, created])
      setSelectedTagIds((prev) => [...prev, created.id])
      setCustomTagName("")
    } catch (error) {
      console.error("Failed to create custom tag", error)
      toast.error("We couldn't create that tag. Please try again.")
    } finally {
      setIsCreatingTag(false)
    }
  }

  const handleCreate = async () => {
    if (!onSave) {
      resetForm()
      handleOpenChange(false)
      return
    }

    if (!canSubmit) {
      if (!hasBasicsFilled) {
        toast.error("Add a title and at least a short synopsis (30+ characters).")
        setActiveStep(0)
      } else if (!hasCategoriesSelected) {
        toast.error("Pick a primary and supporting genre to continue.")
        setActiveStep(1)
      }
      return
    }

    setIsSubmitting(true)
    try {
      const aggregatedGenreIds = Array.from(
        new Set([
          ...(primaryGenreId ? [primaryGenreId] : []),
          ...selectedGenreIds,
        ])
      )

      // Prepare payload with both IDs and names for better error handling
      const selectedTagObjects = availableTags.filter(tag => selectedTagIds.includes(tag.id))
      const selectedGenreObjects = availableGenres.filter(genre => aggregatedGenreIds.includes(genre.id))
      const primaryGenreObject = availableGenres.find(genre => genre.id === primaryGenreId)

      const payload: NovelFormData = {
        title: title.trim(),
        description: description.trim(),
        shortDescription: shortDescription.trim() || undefined,
        cover: coverPreview,
        coverFile,
        primaryGenreId,
        genreIds: aggregatedGenreIds,
        tagIds: selectedTagIds,
        contentType,
        language,
        plannedLength,
        maturityRating,
        // Include names as fallback for auto-creation
        tagNames: selectedTagObjects.map(tag => tag.name),
        genreNames: selectedGenreObjects.map(genre => genre.name),
        primaryGenreName: primaryGenreObject?.name,
      }

      await onSave(payload)
      resetForm()
      onOpenChange(false)
    } catch (error: any) {
      const message = error?.message ?? "Failed to create novel. Please try again."
      toast.error(message)
      console.error("Novel creation failed", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderBasicsStep = () => (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="novel-title">Novel Title *</Label>
        <Input
          id="novel-title"
          placeholder="Give your story a headline"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          A clear, memorable title helps readers recognise your work instantly.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="novel-synopsis">Synopsis *</Label>
        <Textarea
          id="novel-synopsis"
          placeholder="Pitch your story in a compelling way (minimum 30 characters)"
          className="min-h-[140px]"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="novel-short-description">Short Description</Label>
        <Input
          id="novel-short-description"
          placeholder="One-line elevator pitch (optional)"
          value={shortDescription}
          onChange={(event) => setShortDescription(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Cover Image</Label>
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            coverPreview ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/60"
          )}
        >
          {coverPreview ? (
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xs overflow-hidden rounded-md shadow-md">
              <img src={coverPreview} alt="Novel cover preview" className="h-full w-full object-cover" />
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-2 left-1/2 -translate-x-1/2"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace image
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-2 top-2 h-7 w-7 rounded-full"
                onClick={resetCover}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="flex w-full flex-col items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload a striking cover to boost click-through rates
              </span>
              <span className="text-xs text-muted-foreground">PNG or JPG, 800x600px, max 5MB</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={handleCoverSelection}
        />
      </div>
    </div>
  )

  const renderCategoriesStep = () => (
    <div className="grid gap-6">
      {optionError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {optionError}
        </div>
      ) : isLoadingOptions ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading genres and tags...
        </div>
      ) : (
        <>
          <div className="grid gap-2">
            <Label>Primary Genre *</Label>
            <Select
              value={primaryGenreId ? String(primaryGenreId) : ""}
              onValueChange={(value) => setPrimaryGenreId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the best-fit genre" />
              </SelectTrigger>
              <SelectContent>
                {availableGenres.map((genre) => (
                  <SelectItem key={genre.id} value={String(genre.id)}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This determines where your novel appears in discovery feeds.
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Supporting Genres</Label>
            <Select
              value={supportingGenreSelectValue}
              onValueChange={(value) => {
                const numericId = Number(value)
                setSupportingGenreSelectValue("")
                if (!primaryGenreId || numericId !== primaryGenreId) {
                  toggleSupportingGenre(numericId)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select 1 complementary genre" />
              </SelectTrigger>
              <SelectContent>
                {availableGenres
                  .filter((genre) => genre.id !== primaryGenreId)
                  .map((genre) => (
                    <SelectItem key={genre.id} value={String(genre.id)}>
                      {genre.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {supportingGenres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="gap-1"
                  onClick={() => toggleSupportingGenre(genre.id)}
                >
                  {genre.name}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {supportingGenres.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  Choose one supporting genre to reinforce your story's theme.
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Tags (up to {MAX_TAGS})</Label>
              <span className="text-xs text-muted-foreground">
                {selectedTagIds.length}/{MAX_TAGS} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="default"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {selectedTags.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  Add descriptive tags so readers can find your story.
                </span>
              )}
            </div>
            <Input
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(event) => setTagSearch(event.target.value)}
            />
            <div className="max-h-64 overflow-y-auto rounded-lg border border-dashed border-muted/40 p-3">
              {filteredTags.length === 0 ? (
                <span className="text-xs text-muted-foreground">No tags match your search.</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id)
                    return (
                      <Badge
                        key={tag.id}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
        </>
      )}
    </div>
  )

  const renderPublishingStep = () => (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label>Content Type</Label>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Original">Original</SelectItem>
            <SelectItem value="Fanfic">Fanfic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Primary Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Planned Length</Label>
        <Select value={plannedLength} onValueChange={setPlannedLength}>
          <SelectTrigger>
            <SelectValue />
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

      <div className="grid gap-2">
        <Label>Maturity Rating</Label>
        <Select value={maturityRating} onValueChange={setMaturityRating}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="PG-13">PG-13</SelectItem>
            <SelectItem value="Adult">Adult</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Launch checklist</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Draft at least one chapter after creating the project.</li>
          <li>Upload an 800x600 cover to stand out in discovery feeds.</li>
          <li>Keep your synopsis concise with a strong hook.</li>
        </ul>
      </div>
    </div>
  )

  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl space-y-6">
        <DialogHeader>
          <DialogTitle className="gradient-heading">Create a New Web Novel</DialogTitle>
          <DialogDescription>
            Walk through the essentials so we can scaffold your project and connect it to the right readers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3">
          {CREATION_STEPS.map((step, index) => {
            const isCompleted = index < activeStep
            const isCurrent = index === activeStep
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    isCurrent && "bg-primary text-primary-foreground",
                    isCompleted && !isCurrent && "bg-primary/20 text-primary",
                    !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                {index < CREATION_STEPS.length - 1 && (
                  <span className="text-muted-foreground">/</span>
                )}
              </div>
            )
          })}
        </div>

        {activeStep === 0 && renderBasicsStep()}
        {activeStep === 1 && renderCategoriesStep()}
        {activeStep === 2 && renderPublishingStep()}

        <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {activeStep === 0 &&
              "Tip: A memorable title + synopsis drives more profile clicks."}
            {activeStep === 1 &&
              "Add tags that reflect themes, tropes, or key elements of your story."}
            {activeStep === 2 &&
              "You can fine-tune publishing settings later from the project dashboard."}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (activeStep === 0) {
                  handleOpenChange(false)
                } else {
                  setActiveStep((step) => Math.max(0, step - 1))
                }
              }}
              disabled={isSubmitting}
            >
              {secondaryActionLabel}
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (isLastStep) {
                  void handleCreate()
                } else if (!primaryActionDisabled) {
                  setActiveStep((step) => Math.min(step + 1, CREATION_STEPS.length - 1))
                }
              }}
              disabled={primaryActionDisabled}
            >
              {primaryActionLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
