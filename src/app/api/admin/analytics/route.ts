import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

const prisma = new PrismaClient();

interface DecodedToken {
  userId: string;
  role: string;
}

async function getDecodedToken(req: NextRequest): Promise<DecodedToken | null> {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-secret');
    const { payload } = await jose.jwtVerify(token, secret);
    const decoded = payload as { userId?: string; role?: string };
    if (!decoded.userId || !decoded.role) {
      return null;
    }
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const decodedToken = await getDecodedToken(req);
  if (!decodedToken || decodedToken.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const userCount = await prisma.user.count();
    const novelCount = await prisma.novel.count();
    const chapterCount = await prisma.chapter.count();
    const commentCount = await prisma.comment.count();
    const reviewCount = await prisma.review.count();
    const ratingCount = await prisma.rating.count();

    const analyticsData = {
      userCount,
      novelCount,
      chapterCount,
      commentCount,
      reviewCount,
      ratingCount,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
