import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

type RouteContext = {
  params?: Promise<{
    id: string;
  }>;
};

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  try {
    const { id } = params;
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      select: {
        wordCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    // You can add more stats here later, like reading time.
    const stats = {
      wordCount: chapter.wordCount,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get chapter stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
