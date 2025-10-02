import { Cloudinary } from '@cloudinary/url-gen'
import { auto } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity'
import { quality } from '@cloudinary/url-gen/actions/delivery'
import { format } from '@cloudinary/url-gen/actions/delivery'

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
})

// Configuration
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
}

// Validation function to check if Cloudinary is properly configured
export const validateCloudinaryConfig = () => {
  const errors = []
  
  if (!cloudinaryConfig.cloudName) {
    errors.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set')
  }
  
  if (!cloudinaryConfig.uploadPreset) {
    errors.push('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set')
  }
  
  // API key and secret are only needed for server-side operations
  if (typeof window === 'undefined') {
    if (!cloudinaryConfig.apiKey) {
      errors.push('CLOUDINARY_API_KEY is not set (needed for server-side operations)')
    }
    
    if (!cloudinaryConfig.apiSecret) {
      errors.push('CLOUDINARY_API_SECRET is not set (needed for server-side operations)')
    }
  }
  
  if (errors.length > 0) {
    console.warn('Cloudinary configuration issues:', errors)
  }
  
  return errors.length === 0
}

// Upload configuration for different image types
// Note: For unsigned uploads, transformations should be configured in the Cloudinary upload preset
export const uploadConfig = {
  coverImage: {
    folder: 'novel-covers',
    // Transformations are applied via URL generation or upload preset
  },
  profilePicture: {
    folder: 'profile-pictures',
    // Transformations are applied via URL generation or upload preset
  },
  thumbnail: {
    folder: 'thumbnails',
    // Transformations are applied via URL generation or upload preset
  },
}

// Helper function to generate optimized image URLs
export const generateImageUrl = (
  publicId: string,
  type: 'cover' | 'profile' | 'thumbnail' = 'cover'
) => {
  const image = cld.image(publicId)
  
  switch (type) {
    case 'profile':
      return image
        .resize(auto().width(400).height(400).gravity(autoGravity()))
        .delivery(quality('auto'))
        .delivery(format('auto'))
        .toURL()
    
    case 'thumbnail':
      return image
        .resize(auto().width(225).height(300).gravity(autoGravity()))
        .delivery(quality('auto'))
        .delivery(format('auto'))
        .toURL()
    
    case 'cover':
    default:
      return image
        .resize(auto().width(600).height(800).gravity(autoGravity()))
        .delivery(quality('auto'))
        .delivery(format('auto'))
        .toURL()
  }
}

// Helper function to get the public ID from a Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url)
    // Cloudinary delivery URLs typically have the form:
    // https://res.cloudinary.com/<cloud>/image/upload/v<version>/<folder>/<name>.<ext>
    // We want <folder>/<name> (without extension), preserving folder path
    const parts = parsed.pathname.split('/')
    const uploadIndex = parts.findIndex((p) => p === 'upload')
    if (uploadIndex === -1) return null

    // Slice everything after 'upload'
    let after = parts.slice(uploadIndex + 1)

    // Drop version segment if present (e.g., v1699999999)
    if (after[0] && /^v\d+$/.test(after[0])) {
      after = after.slice(1)
    }

    if (after.length === 0) return null

    // Remove extension from last segment
    const last = after[after.length - 1]
    const withoutExt = last.replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, '')
    after[after.length - 1] = withoutExt

    return after.join('/')
  } catch {
    return null
  }
}

// Validation helper
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, or WebP)',
    }
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB',
    }
  }
  
  return { isValid: true }
}

export default cld
