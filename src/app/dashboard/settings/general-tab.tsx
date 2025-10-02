"use client"

import { useEffect, useState } from "react"
import { User, Save, Camera, Check, X } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { Input } from "@/components/dashboard/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Separator } from "@/components/dashboard/ui/separator"
import { Label } from "@/components/dashboard/ui/label"
import { Textarea } from "@/components/dashboard/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/ui/select"
import { cn } from "@/lib/utils"
import { ProfilePictureUpload } from '@/components/ui/profile-picture-upload'
import { api } from '@/services/api'

// Continental timezones grouped by region
const TIMEZONES = [
  { value: "America/New_York", label: "North America - Eastern Time (ET)" },
  { value: "America/Chicago", label: "North America - Central Time (CT)" },
  { value: "America/Denver", label: "North America - Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "North America - Pacific Time (PT)" },
  { value: "America/Sao_Paulo", label: "South America - São Paulo (BRT)" },
  { value: "America/Argentina/Buenos_Aires", label: "South America - Buenos Aires (ART)" },
  { value: "America/Lima", label: "South America - Lima (PET)" },
  { value: "Europe/London", label: "Europe - London (GMT/BST)" },
  { value: "Europe/Paris", label: "Europe - Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Europe - Berlin (CET/CEST)" },
  { value: "Europe/Rome", label: "Europe - Rome (CET/CEST)" },
  { value: "Europe/Madrid", label: "Europe - Madrid (CET/CEST)" },
  { value: "Europe/Moscow", label: "Europe - Moscow (MSK)" },
  { value: "Africa/Cairo", label: "Africa - Cairo (EET)" },
  { value: "Africa/Lagos", label: "Africa - Lagos (WAT)" },
  { value: "Africa/Johannesburg", label: "Africa - Johannesburg (SAST)" },
  { value: "Asia/Dubai", label: "Asia - Dubai (GST)" },
  { value: "Asia/Kolkata", label: "Asia - Kolkata (IST)" },
  { value: "Asia/Shanghai", label: "Asia - Shanghai (CST)" },
  { value: "Asia/Tokyo", label: "Asia - Tokyo (JST)" },
  { value: "Asia/Seoul", label: "Asia - Seoul (KST)" },
  { value: "Asia/Bangkok", label: "Asia - Bangkok (ICT)" },
  { value: "Asia/Singapore", label: "Asia - Singapore (SGT)" },
  { value: "Australia/Sydney", label: "Australia - Sydney (AEDT/AEST)" },
  { value: "Australia/Melbourne", label: "Australia - Melbourne (AEDT/AEST)" },
  { value: "Australia/Perth", label: "Australia - Perth (AWST)" },
  { value: "Pacific/Auckland", label: "Oceania - Auckland (NZDT/NZST)" }
]

export interface GeneralInfo {
  firstName: string
  lastName: string
  username: string
  email: string
  bio: string
  timezone: string
  patreonUrl: string
  imageURI?: string
  bannerImageURI?: string | null
}

interface GeneralTabProps {
  saveStatus: "idle" | "saving" | "saved" | "error"
  defaultInfo: GeneralInfo | null
  onSave: (updates: GeneralInfo & { imageFile?: File | null }) => void
  isLoading?: boolean
  error?: string | null
}

export function GeneralTab({ saveStatus, defaultInfo, onSave, isLoading = false, error }: GeneralTabProps) {
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>(() =>
    defaultInfo ?? {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      bio: "",
      timezone: "",
      patreonUrl: "",
      imageURI: undefined,
      bannerImageURI: undefined,
    },
  )

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [imageUpload, setImageUpload] = useState<File | null>(null)

  useEffect(() => {
    if (defaultInfo) {
      setGeneralInfo({ ...defaultInfo })
      setImageUpload(null)
    }
  }, [defaultInfo])

  if (isLoading && !defaultInfo) {
    return (
      <Card className="novel-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Loading profile…
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Fetching your latest account details.</p>
        </CardContent>
      </Card>
    )
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!generalInfo.firstName.trim()) errors.firstName = "First name is required"
    if (!generalInfo.lastName.trim()) errors.lastName = "Last name is required"
    if (generalInfo.bio.length > 500) errors.bio = "Bio must be 500 characters or less"
    
    return errors
  }

  const handleSave = () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    onSave({ ...generalInfo, imageFile: imageUpload })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageUpload(file)
      // Here you would typically upload to your backend
      console.log("Uploading image:", file.name)
    }
  }

  // Handle profile picture upload with Cloudinary
  const handleProfileImageUploaded = async (imageUrl: string, publicId: string) => {
    const previousImageURI = generalInfo.imageURI
    
    // Update the local state immediately for UI feedback
    setGeneralInfo(prev => ({ ...prev, imageURI: imageUrl }))
    
    // Save to backend immediately
    try {
      const payload = { imageURI: imageUrl }
      const response = await api.updateProfile(payload)
      console.log('Profile picture updated successfully')
    } catch (error) {
      console.error('Failed to update profile picture:', error)
      // Revert the UI change if the backend update fails
      setGeneralInfo(prev => ({ ...prev, imageURI: previousImageURI }))
      throw error // Re-throw so the component can show an error message
    }
  }

  return (
    <Card className="novel-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Profile Picture</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload and manage your profile picture
            </p>
          </div>
          <ProfilePictureUpload
            currentImageUrl={generalInfo.imageURI}
            onImageUploaded={handleProfileImageUploaded}
            onImageRemoved={() => {}} // No-op, remove button is hidden
            disabled={isLoading}
            size="lg"
            showRemoveButton={false}
          />
        </div>

        <Separator />

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={generalInfo.firstName}
              onChange={(e) => {
                setGeneralInfo({...generalInfo, firstName: e.target.value})
                if (formErrors.firstName) {
                  setFormErrors(prev => ({...prev, firstName: ""}))
                }
              }}
              className={formErrors.firstName ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {formErrors.firstName && (
              <p className="text-sm text-destructive">{formErrors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={generalInfo.lastName}
              onChange={(e) => {
                setGeneralInfo({...generalInfo, lastName: e.target.value})
                if (formErrors.lastName) {
                  setFormErrors(prev => ({...prev, lastName: ""}))
                }
              }}
              className={formErrors.lastName ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {formErrors.lastName && (
              <p className="text-sm text-destructive">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={generalInfo.email}
            disabled
            className="bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        {/* Username (Editable) */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={generalInfo.username}
            onChange={(e) => setGeneralInfo({...generalInfo, username: e.target.value})}
            placeholder="Choose your username"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Your unique identifier across the platform
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell your readers about yourself..."
            className={cn("min-h-[100px]", formErrors.bio ? "border-destructive" : "")}
            value={generalInfo.bio}
            onChange={(e) => {
              setGeneralInfo({...generalInfo, bio: e.target.value})
              if (formErrors.bio) {
                setFormErrors(prev => ({...prev, bio: ""}))
              }
            }}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center">
            <p className={cn(
              "text-sm",
              generalInfo.bio.length > 450 ? "text-amber-600" : "text-muted-foreground",
              generalInfo.bio.length > 500 ? "text-destructive" : ""
            )}>
              {generalInfo.bio.length}/500 characters
            </p>
            {formErrors.bio && (
              <p className="text-sm text-destructive">{formErrors.bio}</p>
            )}
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={generalInfo.timezone}
            onValueChange={(value) => setGeneralInfo({...generalInfo, timezone: value})}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Used for scheduling and time-based features
          </p>
        </div>

        {/* Patreon URL */}
        <div className="space-y-2">
          <Label htmlFor="patreonUrl">Patreon Link (Optional)</Label>
          <Input
            id="patreonUrl"
            type="url"
            placeholder="https://www.patreon.com/yourname"
            value={generalInfo.patreonUrl}
            onChange={(e) => setGeneralInfo({...generalInfo, patreonUrl: e.target.value})}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Share your Patreon page with your readers
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saveStatus === "saving" || isLoading}
            className="min-w-[120px]"
          >
            {saveStatus === "saving" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Saved!
              </>
            ) : saveStatus === "error" ? (
              <>
                <X className="h-4 w-4 text-destructive mr-2" />
                Fix errors above
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
