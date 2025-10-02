import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

const prisma = new PrismaClient();

interface DecodedToken {
  userId: string;
  role: string;
}

type RouteContext = {
  params?: Promise<{
    id: string;
  }>;
};

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

export async function PUT(req: NextRequest, context: RouteContext) {
  const decodedToken = await getDecodedToken(req);
  if (!decodedToken || decodedToken.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const params = await context.params;
    if (!params) {
      return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
    }
    const userId = params.id;
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ message: 'Missing role field' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const decodedToken = await getDecodedToken(req);
  if (!decodedToken || decodedToken.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const params = await context.params;
    if (!params) {
      return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
    }
    const userId = params.id;

    if (userId === decodedToken.userId) {
      return NextResponse.json({ message: 'Admins cannot delete themselves' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
