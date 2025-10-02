import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { folder } = await request.json()
    
    if (!folder) {
      return NextResponse.json(
        { error: 'Folder is required' },
        { status: 400 }
      )
    }
    
    const timestamp = Math.round(new Date().getTime() / 1000)
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary API secret not configured' },
        { status: 500 }
      )
    }
    
    // Create the signature using Cloudinary helper
    const paramsToSign: Record<string, string | number> = {
      folder,
      timestamp,
    }
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret)
    
    return NextResponse.json({ signature, timestamp, api_key: process.env.CLOUDINARY_API_KEY })
  } catch (error) {
    console.error('Error generating signature:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
