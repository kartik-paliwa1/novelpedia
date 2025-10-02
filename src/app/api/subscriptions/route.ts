import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

const prisma = new PrismaClient();

interface DecodedToken {
  userId: string;
}

async function getUserIdFromToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-secret');
    const { payload } = await jose.jwtVerify(token, secret);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { followingId, action }: { followingId: string; action: 'follow' | 'unfollow' } = await req.json();

    if (!followingId || !action) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (userId === followingId) {
        return NextResponse.json({ message: 'You cannot follow yourself' }, { status: 400 });
    }

    if (action === 'follow') {
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId,
        },
      });
      return NextResponse.json({ message: 'Successfully followed user' });
    } else if (action === 'unfollow') {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId,
          },
        },
      });
      return NextResponse.json({ message: 'Successfully unfollowed user' });
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(following.map(f => f.following));
  } catch (error) {
    console.error('Get following error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
