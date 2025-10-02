import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as jose from 'jose'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const { coverImageUrl, publicId } = await request.json()

    if (!coverImageUrl) {
      return NextResponse.json(
        { error: 'Cover image URL is required' },
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

    // Check if novel exists and user is the author
    const novel = await prisma.novel.findUnique({
      where: { id },
      select: { id: true, authorId: true, title: true },
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    if (novel.authorId !== userId) {
      return NextResponse.json(
        { error: 'You can only update covers for your own novels' },
        { status: 403 }
      )
    }

    // Update novel with new cover image URL
    const updatedNovel = await prisma.novel.update({
      where: { id },
      data: { coverImageUrl },
      select: {
        id: true,
        title: true,
        coverImageUrl: true,
        authorId: true,
        status: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: 'Novel cover updated successfully',
      novel: updatedNovel,
    })
  } catch (error) {
    console.error('Error updating novel cover:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

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

    // Check if novel exists and user is the author
    const novel = await prisma.novel.findUnique({
      where: { id },
      select: { id: true, authorId: true, title: true },
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    if (novel.authorId !== userId) {
      return NextResponse.json(
        { error: 'You can only update covers for your own novels' },
        { status: 403 }
      )
    }

    // Remove cover image URL from novel
    const updatedNovel = await prisma.novel.update({
      where: { id },
      data: { coverImageUrl: null },
      select: {
        id: true,
        title: true,
        coverImageUrl: true,
        authorId: true,
        status: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: 'Novel cover removed successfully',
      novel: updatedNovel,
    })
  } catch (error) {
    console.error('Error removing novel cover:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}