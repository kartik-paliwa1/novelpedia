'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/common/components/ui/button'
import { Progress } from '@/common/components/ui/progress'
import { Upload, X, ImageIcon, Loader2, Check, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/utils/utils'
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary-upload'
import { generateImageUrl, getPublicIdFromUrl } from '@/lib/cloudinary'
import { toast } from 'react-hot-toast'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'

// Utility function to create cropped image
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area,
  fileName: string
): Promise<File> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Set canvas size to target dimensions (600x800)
  canvas.width = 600
  canvas.height = 800

  // Draw the cropped image scaled to 600x800
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    600,
    800
  )

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'))
        return
      }
      const file = new File([blob], fileName, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      })
      resolve(file)
    }, 'image/jpeg', 0.95)
  })
}

// Helper to create an image element
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

interface CoverImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (imageUrl: string, publicId: string) => void
  onImageRemoved: () => void
  className?: string
  disabled?: boolean
  aspectRatio?: 'cover' | 'square'
}

export function CoverImageUpload({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  className,
  disabled = false,
  aspectRatio = 'cover'
}: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || disabled) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Show crop dialog
    setSelectedFile(file)
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)
    setShowCropDialog(true)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleCropConfirm = async () => {
    if (!selectedFile || !previewUrl || !croppedAreaPixels) return

    try {
      setIsUploading(true)
      setUploadProgress(0)
      setShowCropDialog(false)

      // Crop and resize the image to 600x800
      const croppedFile = await createCroppedImage(
        previewUrl,
        croppedAreaPixels,
        selectedFile.name
      )

      // Upload to Cloudinary with cropped file
      const result = await uploadToCloudinary(croppedFile, 'cover', (progress) => {
        setUploadProgress(progress)
      })

      // Generate optimized URL with 600x800 dimensions
      const optimizedUrl = generateImageUrl(result.public_id, 'cover')

      // Clean up
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setSelectedFile(null)

      // Notify parent component
      onImageUploaded(optimizedUrl, result.public_id)
      
      toast.success('Cover image uploaded successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setSelectedFile(null)
      
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

  const handleCropCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setSelectedFile(null)
    setShowCropDialog(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 1))
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
      toast.success('Cover image removed')
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

  const displayImage = !showCropDialog && (currentImageUrl)
  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-[3/4]' // 600x800 aspect ratio

  return (
    <>
      {/* Crop Dialog */}
      {showCropDialog && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
            <h3 className="text-lg font-semibold mb-2">Adjust Cover Image</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag to position and zoom to adjust. The selected area will be resized to 600×800 pixels.
            </p>
            
            <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-4 mt-4">
              <Button
                type="button"
                onClick={handleZoomOut}
                variant="outline"
                size="sm"
                disabled={zoom <= 1}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <Button
                type="button"
                onClick={handleZoomIn}
                variant="outline"
                size="sm"
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={handleCropCancel}
                variant="outline"
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCropConfirm}
                className="flex-1"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm & Upload
                  </>
                )}
              </Button>
            </div>
            
            {isUploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className={cn('space-y-4', className)}>
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border-2 border-dashed transition-colors',
            displayImage ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/60',
            disabled && 'opacity-50 cursor-not-allowed',
            aspectClass
          )}
        >
        {displayImage ? (
          // Image preview
          <div className="relative h-full w-full group">
            <img
              src={currentImageUrl}
              alt="Cover preview"
              className="h-full w-full object-cover"
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={triggerFileSelect}
                disabled={disabled || isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Replace
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemoveImage}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>

            {/* Upload progress overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-white text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <div className="text-sm">Uploading...</div>
                  <Progress value={uploadProgress} className="w-32" />
                </div>
              </div>
            )}
          </div>
        ) : (
          // Upload area
          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={disabled || isUploading}
            className="h-full w-full flex flex-col items-center justify-center gap-2 p-8 hover:bg-muted/50 transition-colors disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Uploading...</span>
                <Progress value={uploadProgress} className="w-32" />
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Upload cover image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, or WebP up to 5MB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Auto-resized to: 600×800px
                  </p>
                </div>
              </>
            )}
          </button>
        )}
      </div>

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
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Images will be automatically resized to 600×800px</p>
            <p>• You can select and crop your image before upload</p>
            <p>• Use high-quality images for better results</p>
            <p>• Best results with 3:4 aspect ratio images</p>
          </div>
        )}
      </div>
    </>
  )
}
