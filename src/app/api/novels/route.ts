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
    const { title, genre, synopsis, tags, coverImageUrl, status } = await req.json();

    if (!title || !genre || !synopsis) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const novel = await prisma.novel.create({
      data: {
        authorId: userId,
        title,
        genre,
        synopsis,
        tags: tags || '', // since it's a string now
        coverImageUrl,
        status,
      },
    });

    return NextResponse.json(novel, { status: 201 });
  } catch (error) {
    console.error('Create novel error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
        const novels = await prisma.novel.findMany({
            include: {
                author: {
                    select: {
                        username: true
                    }
                }
            }
        });
        return NextResponse.json(novels);
    } catch (error) {
        console.error('Get novels error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
