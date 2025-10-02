'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/common/components/ui/button'
import { Progress } from '@/common/components/ui/progress'
import { Camera, X, User, Loader2 } from 'lucide-react'
import { cn } from '@/utils/utils'
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary-upload'
import { generateImageUrl, getPublicIdFromUrl } from '@/lib/cloudinary'
import { toast } from 'react-hot-toast'

interface ProfilePictureUploadProps {
  currentImageUrl?: string
  onImageUploaded: (imageUrl: string, publicId: string) => void
  onImageRemoved: () => void
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  showRemoveButton?: boolean
}

export function ProfilePictureUpload({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  className,
  disabled = false,
  size = 'md',
  showRemoveButton = true
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || disabled) return

    // Create local preview
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, 'profile', (progress) => {
        setUploadProgress(progress)
      })

      // Generate optimized URL
      const optimizedUrl = generateImageUrl(result.public_id, 'profile')

      // Clean up local preview
      URL.revokeObjectURL(localPreview)
      setPreviewUrl(null)

      // Notify parent component
      onImageUploaded(optimizedUrl, result.public_id)
      
      toast.success('Profile picture updated successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
      URL.revokeObjectURL(localPreview)
      setPreviewUrl(null)
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async () => {
    if (!currentImageUrl || disabled) return

    try {
      // Extract robust public ID (preserves folder path)
      const publicId = getPublicIdFromUrl(currentImageUrl)
      if (publicId) {
        await deleteFromCloudinary(publicId)
      }
      
      onImageRemoved()
      toast.success('Profile picture removed')
    } catch (error) {
      console.error('Failed to remove image:', error)
      toast.error('Failed to remove image')
    }
  }

  const triggerFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const displayImage = previewUrl || currentImageUrl

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Avatar Container */}
      <div className="relative">
        <div
          className={cn(
            'relative overflow-hidden rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 p-1 shadow-lg',
            sizeClasses[size],
            disabled && 'opacity-50'
          )}
        >
          <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className={cn('text-gray-400', iconSizes[size])} />
            )}
          </div>

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/80 rounded-full flex flex-col items-center justify-center gap-1">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <div className="text-xs text-white">
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>

        {/* Camera Button */}
        <button
          onClick={triggerFileSelect}
          disabled={disabled || isUploading}
          className={cn(
            'absolute -bottom-1 -right-1 bg-violet-600 hover:bg-violet-500 rounded-full border-2 border-gray-800 flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'
          )}
        >
          <Camera className={cn('text-white', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={triggerFileSelect}
          disabled={disabled || isUploading}
        >
          <Camera className="h-4 w-4 mr-2" />
          {displayImage ? 'Change' : 'Upload'}
        </Button>
        
        {displayImage && showRemoveButton && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRemoveImage}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-32 space-y-1">
          <Progress value={uploadProgress} />
          <div className="text-xs text-center text-muted-foreground">
            Uploading... {uploadProgress}%
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload tips */}
      {!displayImage && (
        <div className="text-xs text-center text-muted-foreground max-w-xs">
          <p>Recommended: Square image, 400×400px</p>
          <p>PNG, JPG, or WebP up to 5MB</p>
        </div>
      )}
    </div>
  )
}
