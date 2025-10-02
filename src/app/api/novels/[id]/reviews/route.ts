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

export async function POST(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const novelId = params.id;
    const { title, content, rating } = await req.json();

    if (!title || !content || rating === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        novelId,
        title,
        content,
        rating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  try {
    const novelId = params.id;

    const reviews = await prisma.review.findMany({
      where: { novelId },
      include: {
        user: {
          select: {
            username: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
