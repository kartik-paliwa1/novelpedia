import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Validate Cloudinary configuration
function validateConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  
  if (!cloudName) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured')
  }
  
  if (!apiKey) {
    throw new Error('CLOUDINARY_API_KEY is not configured')
  }
  
  if (!apiSecret) {
    throw new Error('CLOUDINARY_API_SECRET is not configured')
  }
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Validate configuration first
    validateConfig()
    
    console.log('Cloudinary config:', {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    })
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string
    const type = formData.get('type') as string || 'image'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }
    
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
    
    // Set upload options based on type
    const uploadOptions: any = {
      folder: folder || 'uploads',
      resource_type: 'auto',
      quality: 'auto',
      format: 'auto',
      tags: [type, 'novel-pedia'],
    }
    
    // Add transformations based on type
    if (type === 'profile') {
      uploadOptions.transformation = [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' }
      ]
    } else if (type === 'cover') {
      uploadOptions.transformation = [
        { width: 800, height: 600, crop: 'fill', gravity: 'auto' }
      ]
    }
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, uploadOptions)
    
    return NextResponse.json({
      public_id: result.public_id,
      version: result.version,
      signature: result.signature,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
      tags: result.tags,
      bytes: result.bytes,
      type: result.type,
      etag: result.etag,
      placeholder: result.placeholder,
      url: result.url,
      secure_url: result.secure_url,
      access_mode: result.access_mode,
      original_filename: result.original_filename,
      api_key: process.env.CLOUDINARY_API_KEY,
    })
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error)
    
    let errorMessage = 'Upload failed'
    if (error.message) {
      errorMessage = error.message
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}