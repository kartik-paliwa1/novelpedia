import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface DecodedToken {
  userId: string;
  role: string;
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: DecodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret') as DecodedToken;
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.username || user.email.split('@')[0],
        email: user.email,
        role: user.role,
        avatar: null, // Add avatar field when available in schema
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
