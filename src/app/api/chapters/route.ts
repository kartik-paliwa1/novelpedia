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
    const { novelId, title, content } = await req.json();

    if (!novelId || !title || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the user is the author of the novel
    const novel = await prisma.novel.findUnique({
      where: { id: novelId },
    });

    if (!novel || novel.authorId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // a chapter's word count is the number of words in its content
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    // Get the highest order number for this novel and increment
    const lastChapter = await prisma.chapter.findFirst({
      where: { novelId },
      orderBy: { order: 'desc' } as any,
    });
    
    const order = ((lastChapter as any)?.order ?? -1) + 1;

    const chapter = await prisma.chapter.create({
      data: {
        novelId,
        title,
        content,
        wordCount,
        order,
      } as any,
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error('Create chapter error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const novelId = searchParams.get('novelId');

    if (!novelId) {
      return NextResponse.json({ message: 'Missing novelId query parameter' }, { status: 400 });
    }

    const chapters = await prisma.chapter.findMany({
      where: { novelId },
      orderBy: { order: 'asc' } as any,
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Get chapters error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
