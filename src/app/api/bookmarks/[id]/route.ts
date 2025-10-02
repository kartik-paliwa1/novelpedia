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
    const bookmarkId = params.id;

    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark) {
      return NextResponse.json({ message: 'Bookmark not found' }, { status: 404 });
    }

    if (bookmark.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
