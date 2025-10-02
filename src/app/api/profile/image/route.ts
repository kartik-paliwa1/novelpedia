import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as jose from 'jose'

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest) {
  try {
    // Get token from request
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const { imageURI, publicId } = await request.json()

    if (imageURI === null || typeof imageURI === 'string') {
      // Valid values: null to remove, string URL to set
    } else {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      )
    }

    // Decode token to get user information
    let payload
    try {
      payload = jose.decodeJwt(token)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const userId = payload.user_id || payload.sub
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      )
    }

    // Update or create user profile with new image URL
    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        avatarUrl: imageURI,
        bio: null,
        readingPreferences: null,
      },
      update: {
        avatarUrl: imageURI,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: imageURI ? 'Profile image updated successfully' : 'Profile image removed successfully',
      profile: updatedProfile,
    })
  } catch (error) {
    console.error('Error updating profile image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}