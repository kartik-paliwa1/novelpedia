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
  if (!decodedToken || !(decodedToken.role === 'ADMIN' || decodedToken.role === 'MODERATOR')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const flaggedComments = await prisma.comment.findMany({
      where: { isFlagged: true },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(flaggedComments);
  } catch (error) {
    console.error('Get flagged content error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const decodedToken = await getDecodedToken(req);
    if (!decodedToken || !(decodedToken.role === 'ADMIN' || decodedToken.role === 'MODERATOR')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
      const { commentId, action }: { commentId: string; action: 'unflag' | 'delete' } = await req.json();

      if (!commentId || !action) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }

      if (action === 'unflag') {
        await prisma.comment.update({
          where: { id: commentId },
          data: { isFlagged: false },
        });
        return NextResponse.json({ message: 'Comment unflagged successfully' });
      } else if (action === 'delete') {
        await prisma.comment.delete({
          where: { id: commentId },
        });
        return NextResponse.json({ message: 'Comment deleted successfully' });
      } else {
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
      }
    } catch (error) {
      console.error('Moderate content error:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
