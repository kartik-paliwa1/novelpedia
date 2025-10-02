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
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Missing name field' }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        userId,
        name,
        description,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error('Create collection error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const collections = await prisma.collection.findMany({
      where: { userId },
      include: {
        novels: {
          select: {
            id: true,
            title: true,
            coverImageUrl: true,
          },
        },
        _count: {
          select: { novels: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error('Get collections error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
