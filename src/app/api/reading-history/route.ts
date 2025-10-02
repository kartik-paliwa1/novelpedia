import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
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
    const { chapterId, progress } = await req.json();

    if (!chapterId || progress === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const readingHistory = await prisma.readingHistory.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: { progress, lastReadAt: new Date() },
      create: {
        userId,
        chapterId,
        progress,
      },
    });

    return NextResponse.json(readingHistory, { status: 200 });
  } catch (error) {
    console.error('Update reading history error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const readingHistory = await prisma.readingHistory.findMany({
      where: { userId },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            novel: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastReadAt: 'desc',
      },
    });

    return NextResponse.json(readingHistory);
  } catch (error) {
    console.error('Get reading history error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
