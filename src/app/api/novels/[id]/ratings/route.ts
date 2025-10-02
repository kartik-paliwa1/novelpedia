import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
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
    const { value } = await req.json();

    if (value === undefined || typeof value !== 'number' || value < 1 || value > 5) {
      return NextResponse.json({ message: 'Invalid rating value' }, { status: 400 });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_novelId: {
          userId,
          novelId,
        },
      },
      update: { value },
      create: {
        userId,
        novelId,
        value,
      },
    });

    return NextResponse.json(rating, { status: 200 });
  } catch (error) {
    console.error('Create/update rating error:', error);
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

    const ratings = await prisma.rating.findMany({
      where: { novelId },
    });

    if (ratings.length === 0) {
      return NextResponse.json({
        average: 0,
        count: 0,
        distribution: {},
      });
    }

    const total = ratings.reduce((acc, rating) => acc + rating.value, 0);
    const average = total / ratings.length;

    const distribution = ratings.reduce((acc, rating) => {
      acc[rating.value] = (acc[rating.value] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return NextResponse.json({
      average: parseFloat(average.toFixed(2)),
      count: ratings.length,
      distribution,
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
