import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const trendingNovels = await prisma.novel.findMany({
      orderBy: {
        trendingScore: 'desc',
      },
      take: 10, // Return top 10 trending novels
      include: {
        author: {
            select: {
                username: true
            }
        }
      }
    });

    return NextResponse.json(trendingNovels);
  } catch (error) {
    console.error('Get trending novels error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
