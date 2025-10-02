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
    const { avatarUrl, publicId } = await request.json()

    if (!avatarUrl) {
      return NextResponse.json(
        { error: 'Avatar URL is required' },
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

    // Update user profile with new avatar URL
    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        avatarUrl,
        bio: null,
        readingPreferences: null,
      },
      update: {
        avatarUrl,
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
      message: 'Profile picture updated successfully',
      profile: updatedProfile,
    })
  } catch (error) {
    console.error('Error updating profile picture:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest) {
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

    // Remove avatar URL from profile
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        avatarUrl: null,
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
      message: 'Profile picture removed successfully',
      profile: updatedProfile,
    })
  } catch (error) {
    console.error('Error removing profile picture:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}