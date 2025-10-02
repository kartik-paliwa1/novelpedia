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

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);

  try {
    if (userId) {
      // User is authenticated, recommend based on reading history
      const readingHistory = await prisma.readingHistory.findMany({
        where: { userId },
        include: {
          chapter: {
            include: {
              novel: true,
            },
          },
        },
        take: 10,
        orderBy: {
          lastReadAt: 'desc',
        },
      });

      if (readingHistory.length > 0) {
        const readGenres = [...new Set(readingHistory.map(h => h.chapter.novel.genre))];

        const recommendedNovels = await prisma.novel.findMany({
          where: {
            genre: {
              in: readGenres,
            },
            id: {
              notIn: readingHistory.map(h => h.chapter.novel.id),
            },
          },
          take: 10,
        });

        return NextResponse.json(recommendedNovels);
      }
    }

    // For unauthenticated users or users with no reading history, return trending novels
    const trendingNovels = await prisma.novel.findMany({
      orderBy: {
        trendingScore: 'desc',
      },
      take: 10,
    });

    return NextResponse.json(trendingNovels);
  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
