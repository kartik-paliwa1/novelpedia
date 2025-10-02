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
    const userId = params.id;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(following.map(f => f.following));
  } catch (error) {
    console.error('Get following error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
