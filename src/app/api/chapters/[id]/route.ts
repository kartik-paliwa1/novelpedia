import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

type RouteContext = {
  params?: Promise<{
    id: string;
  }>;
};

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

export async function GET(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  try {
    const { id } = params;
    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Get chapter error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const { title, content } = await req.json();

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: { novel: true },
    });

    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    if (chapter.novel.authorId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const wordCount = content ? content.split(/\s+/).filter(Boolean).length : chapter.wordCount;

    const updatedChapter = await prisma.chapter.update({
      where: { id },
      data: {
        title,
        content,
        wordCount,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('Update chapter error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: { novel: true },
    });

    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    if (chapter.novel.authorId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.chapter.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Delete chapter error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
