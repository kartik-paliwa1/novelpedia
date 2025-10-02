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

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      select: {
        follower: {
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

    return NextResponse.json(followers.map(f => f.follower));
  } catch (error) {
    console.error('Get followers error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
