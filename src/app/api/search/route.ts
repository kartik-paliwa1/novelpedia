import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ message: 'Missing query parameter' }, { status: 400 });
    }

    const novels = await prisma.novel.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            synopsis: {
              contains: query,
            },
          },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
        },
      },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ novels, users });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
