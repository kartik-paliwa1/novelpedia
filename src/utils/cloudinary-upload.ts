import { cloudinaryConfig, uploadConfig, validateImageFile, validateCloudinaryConfig } from '@/lib/cloudinary'

export interface CloudinaryUploadResult {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  access_mode: string
  original_filename: string
  api_key: string
}

export interface UploadError {
  error: {
    message: string
    http_code: number
  }
}

export type UploadResponse = CloudinaryUploadResult | UploadError

// Upload image to Cloudinary
export const uploadToCloudinary = async (
  file: File,
  type: 'cover' | 'profile' = 'cover',
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  // Validate Cloudinary configuration
  if (!validateCloudinaryConfig()) {
    throw new Error('Cloudinary is not properly configured. Please check your environment variables.')
  }

  // Validate the file first
  const validation = validateImageFile(file)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  const config = type === 'profile' ? uploadConfig.profilePicture : uploadConfig.coverImage

  try {
    // Try unsigned upload first
    return await uploadWithPreset(file, config, onProgress)
  } catch (error) {
    console.warn('Unsigned upload failed, trying signed upload:', error)
    
    // If unsigned fails, try signed upload as fallback
    try {
      return await uploadWithSignature(file, config, onProgress)
    } catch (signedError) {
      console.error('Both upload methods failed:', signedError)
      throw new Error(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
        `Fallback also failed: ${signedError instanceof Error ? signedError.message : 'Unknown error'}`
      )
    }
  }
}

// Server-side upload (most reliable)
const uploadViaServer = async (
  file: File,
  config: any,
  type: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', config.folder)
  formData.append('type', type)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          onProgress(Math.round(progress))
        }
      })
    }
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText)
          
          if (result.error) {
            reject(new Error(result.error))
          } else {
            resolve(result as CloudinaryUploadResult)
          }
        } catch (error) {
          reject(new Error('Failed to parse upload response'))
        }
      } else {
        let errorMessage = `Upload failed with status ${xhr.status}`
        try {
          const errorResponse = JSON.parse(xhr.responseText)
          if (errorResponse.error) {
            errorMessage += `: ${errorResponse.error}`
          }
        } catch {
          // If we can't parse the error response, just use the status
        }
        reject(new Error(errorMessage))
      }
    }
    
    xhr.onerror = () => {
      reject(new Error('Upload failed due to network error'))
    }
    
    xhr.open('POST', '/api/cloudinary/upload')
    xhr.send(formData)
  })
}

// Signed upload (more secure)
const uploadWithSignature = async (
  file: File,
  config: any,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  // Get signature from our API
  const signResponse = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ folder: config.folder }),
  })

  if (!signResponse.ok) {
    throw new Error('Failed to get upload signature')
  }

  const { signature, timestamp, api_key } = await signResponse.json()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', config.folder)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp.toString())
  formData.append('api_key', api_key)

  // Add tags for better organization
  const tags = [file.type.startsWith('image/') ? 'image' : 'file', 'novel-pedia']
  formData.append('tags', tags.join(','))

  return uploadFormData(formData, onProgress)
}

// Unsigned upload with preset
const uploadWithPreset = async (
  file: File,
  config: any,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  if (!cloudinaryConfig.uploadPreset) {
    throw new Error('No upload preset configured. Please set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables.')
  }

  if (!cloudinaryConfig.cloudName) {
    throw new Error('Cloudinary cloud name not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', cloudinaryConfig.uploadPreset)
  formData.append('folder', config.folder)

  // Add tags for better organization
  const tags = [file.type.startsWith('image/') ? 'image' : 'file', 'novel-pedia']
  formData.append('tags', tags.join(','))

  return uploadFormData(formData, onProgress)
}

// Common upload function
const uploadFormData = async (
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          onProgress(Math.round(progress))
        }
      })
    }
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText) as UploadResponse
          
          if ('error' in result) {
            reject(new Error(result.error.message))
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(new Error('Failed to parse upload response: ' + xhr.responseText))
        }
      } else {
        // Include response text in error for debugging
        let errorMessage = `Upload failed with status ${xhr.status}`
        try {
          const errorResponse = JSON.parse(xhr.responseText)
          if (errorResponse.error && errorResponse.error.message) {
            errorMessage += `: ${errorResponse.error.message}`
          }
        } catch {
          // If we can't parse the error response, include the raw text
          errorMessage += `. Response: ${xhr.responseText}`
        }
        reject(new Error(errorMessage))
      }
    }
    
    xhr.onerror = () => {
      reject(new Error('Upload failed due to network error'))
    }
    
    xhr.open('POST', uploadUrl)
    xhr.send(formData)
  })
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete image')
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw error
  }
}

// Upload multiple images (for batch operations)
export const uploadMultipleImages = async (
  files: File[],
  type: 'cover' | 'profile' = 'cover',
  onProgress?: (overallProgress: number, fileIndex: number, fileProgress: number) => void
): Promise<CloudinaryUploadResult[]> => {
  const results: CloudinaryUploadResult[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    try {
      const result = await uploadToCloudinary(file, type, (fileProgress) => {
        if (onProgress) {
          const overallProgress = ((i / files.length) * 100) + ((fileProgress / files.length))
          onProgress(Math.round(overallProgress), i, fileProgress)
        }
      })
      
      results.push(result)
    } catch (error) {
      console.error(`Failed to upload file ${file.name}:`, error)
      throw error
    }
  }
  
  return results
}

// Generate a signed URL for secure uploads (when needed)
export const generateSignedUrl = async (folder: string): Promise<{
  signature: string
  timestamp: number
  api_key: string
}> => {
  const response = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ folder }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate signed URL')
  }
  
  return await response.json()
}