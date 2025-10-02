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

export async function POST(req: NextRequest) {
  const decodedToken = await getDecodedToken(req);
  if (!decodedToken || !(decodedToken.role === 'MODERATOR' || decodedToken.role === 'ADMIN')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { targetId, action, reason } = await req.json();

    if (!targetId || !action || !reason) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const moderationAction = await prisma.moderationAction.create({
      data: {
        moderatorId: decodedToken.userId,
        targetId,
        action,
        reason,
      },
    });

    // TODO: Implement the actual side-effects of the moderation action,
    // e.g., suspending a user, deleting a comment, etc.

    return NextResponse.json(moderationAction, { status: 201 });
  } catch (error) {
    console.error('Create moderation action error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
