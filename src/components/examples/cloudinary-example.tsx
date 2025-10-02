'use client'

import React, { useState } from 'react'
import { CoverImageUpload } from '@/components/ui/cover-image-upload'
import { ProfilePictureUpload } from '@/components/ui/profile-picture-upload'
import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui/card'
import { Button } from '@/common/components/ui/button'
import { toast } from 'react-hot-toast'

// Example component showing how to integrate Cloudinary uploads
export function CloudinaryExamplePage() {
  const [novelCover, setNovelCover] = useState<string>('')
  const [profilePicture, setProfilePicture] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle novel cover upload
  const handleCoverUploaded = async (imageUrl: string, publicId: string) => {
    setNovelCover(imageUrl)
    
    // Optional: Save to your database immediately
    try {
      const response = await fetch('/api/novels/123/cover', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          coverImageUrl: imageUrl,
          publicId: publicId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save cover image')
      }

      console.log('Cover image saved to database')
    } catch (error) {
      console.error('Error saving cover:', error)
      toast.error('Failed to save cover image to database')
    }
  }

  // Handle novel cover removal
  const handleCoverRemoved = async () => {
    try {
      const response = await fetch('/api/novels/123/cover', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to remove cover image')
      }

      setNovelCover('')
      console.log('Cover image removed from database')
    } catch (error) {
      console.error('Error removing cover:', error)
      toast.error('Failed to remove cover image from database')
    }
  }

  // Handle profile picture upload
  const handleProfileUploaded = async (imageUrl: string, publicId: string) => {
    setProfilePicture(imageUrl)
    
    // Optional: Save to your database immediately
    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          avatarUrl: imageUrl,
          publicId: publicId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile picture')
      }

      console.log('Profile picture saved to database')
    } catch (error) {
      console.error('Error saving profile picture:', error)
      toast.error('Failed to save profile picture to database')
    }
  }

  // Handle profile picture removal
  const handleProfileRemoved = async () => {
    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to remove profile picture')
      }

      setProfilePicture('')
      console.log('Profile picture removed from database')
    } catch (error) {
      console.error('Error removing profile picture:', error)
      toast.error('Failed to remove profile picture from database')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Cloudinary Image Upload Examples
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Novel Cover Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Novel Cover Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <CoverImageUpload
              currentImageUrl={novelCover}
              onImageUploaded={handleCoverUploaded}
              onImageRemoved={handleCoverRemoved}
              disabled={isSubmitting}
            />
            {novelCover && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Current cover URL:</p>
                <p className="truncate">{novelCover}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Picture Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfilePictureUpload
              currentImageUrl={profilePicture}
              onImageUploaded={handleProfileUploaded}
              onImageRemoved={handleProfileRemoved}
              disabled={isSubmitting}
              size="lg"
            />
            {profilePicture && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Current profile URL:</p>
                <p className="truncate">{profilePicture}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Different sizes showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-8 items-end justify-center">
            <div className="text-center">
              <ProfilePictureUpload
                currentImageUrl={profilePicture}
                onImageUploaded={handleProfileUploaded}
                onImageRemoved={handleProfileRemoved}
                disabled={isSubmitting}
                size="sm"
                showRemoveButton={false}
              />
              <p className="mt-2 text-sm text-muted-foreground">Small</p>
            </div>
            
            <div className="text-center">
              <ProfilePictureUpload
                currentImageUrl={profilePicture}
                onImageUploaded={handleProfileUploaded}
                onImageRemoved={handleProfileRemoved}
                disabled={isSubmitting}
                size="md"
                showRemoveButton={false}
              />
              <p className="mt-2 text-sm text-muted-foreground">Medium</p>
            </div>
            
            <div className="text-center">
              <ProfilePictureUpload
                currentImageUrl={profilePicture}
                onImageUploaded={handleProfileUploaded}
                onImageRemoved={handleProfileRemoved}
                disabled={isSubmitting}
                size="lg"
                showRemoveButton={false}
              />
              <p className="mt-2 text-sm text-muted-foreground">Large</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration notes */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Environment Setup Required:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env</li>
              <li>Set CLOUDINARY_API_KEY in .env</li>
              <li>Set CLOUDINARY_API_SECRET in .env</li>
              <li>Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Components Available:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>CoverImageUpload - For novel covers (4:3 aspect ratio)</li>
              <li>ProfilePictureUpload - For user avatars (1:1 aspect ratio)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">API Endpoints Created:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>PATCH /api/profile/avatar - Update user profile picture</li>
              <li>DELETE /api/profile/avatar - Remove user profile picture</li>
              <li>PATCH /api/novels/[id]/cover - Update novel cover</li>
              <li>DELETE /api/novels/[id]/cover - Remove novel cover</li>
              <li>POST /api/cloudinary/delete - Delete image from Cloudinary</li>
              <li>POST /api/cloudinary/sign - Generate signed upload URLs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}