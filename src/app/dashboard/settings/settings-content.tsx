"use client"

import { useEffect, useState } from "react"
import { User, CreditCard, Bell } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs"
import { GeneralTab, type GeneralInfo } from "./general-tab"
import { BankingTab } from "./banking-tab"
import { NotificationsTab } from "./notifications-tab"
import { api, type UpdateProfilePayload, type UserProfile } from "@/services/api"
import { useAuth } from "@/contexts/auth-context"

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("general")
  const { checkAuth } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [generalDefaults, setGeneralDefaults] = useState<GeneralInfo | null>(null)

  const buildGeneralDefaults = (user: UserProfile, prev: GeneralInfo | null): GeneralInfo => {
    const name = (user.name ?? "").trim()
    const nameParts = name.length ? name.split(/\s+/).filter(Boolean) : []
    const firstName = nameParts.shift() ?? name
    const lastName = nameParts.join(" ")

    return {
      firstName,
      lastName,
      username: user.name ?? prev?.username ?? "",
      email: user.email ?? prev?.email ?? "",
      bio: user.bio ?? prev?.bio ?? "",
      timezone: user.timezone ?? prev?.timezone ?? "",
      patreonUrl: user.patreonUrl ?? prev?.patreonUrl ?? "",
      imageURI: user.imageURI ?? prev?.imageURI ?? undefined,
      bannerImageURI: user.bannerImageURI ?? prev?.bannerImageURI ?? undefined,
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        const response = await api.getProfile()
        setProfile(response.data)
        setGeneralDefaults(prev => buildGeneralDefaults(response.data, prev))
        setError(null)
      } catch (err) {
        console.error("Failed to load profile", err)
        setError("Unable to load your profile at the moment. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [])

  const handleGeneralSave = async (values: GeneralInfo & { imageFile?: File | null }) => {
    if (!profile) {
      return
    }

    setSaveStatus("saving")
    setError(null)

    const fullName = [values.firstName, values.lastName].filter(Boolean).join(" ").trim()
    const payload: UpdateProfilePayload = {
      name: values.username || fullName || profile.name,
      bio: values.bio,
      imageURI: values.imageURI ?? undefined,
      bannerImageURI: values.bannerImageURI ?? undefined,
      timezone: values.timezone || undefined,
      patreonUrl: values.patreonUrl || undefined,
    }

    if (values.imageFile) {
      console.log("Image file detected, but profile pictures are now handled via Cloudinary component.")
    }

    try {
      const response = await api.updateProfile(payload)
      setProfile(response.data)
      setGeneralDefaults(prev => ({
        ...(prev ?? values),
        ...values,
        username: response.data.name ?? values.username,
        email: response.data.email ?? values.email,
        imageURI: response.data.imageURI ?? values.imageURI,
        bannerImageURI: response.data.bannerImageURI ?? values.bannerImageURI,
      }))
      await checkAuth()
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 1500)
    } catch (err: any) {
      console.error("Failed to update profile", err)
      setSaveStatus("error")
      const detail = err?.details ?? err?.message
      setError(typeof detail === "string" ? detail : "Failed to save your changes. Please try again.")
    }
  }

  const generalInfo = generalDefaults

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-heading">Settings</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your account settings, personal information, and payment details
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="banking" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Banking</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-6 mt-8">
          <GeneralTab
            saveStatus={saveStatus}
            defaultInfo={generalInfo}
            onSave={handleGeneralSave}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        {/* Banking Information Tab */}
        <TabsContent value="banking" className="space-y-6 mt-8">
          <BankingTab />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-8">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
