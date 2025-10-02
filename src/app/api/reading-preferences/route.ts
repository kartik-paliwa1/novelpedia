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

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { readingPreferences: true },
    });

    if (!profile) {
      // If profile doesn't exist, create one with default preferences
      const newProfile = await prisma.profile.create({
        data: {
          userId,
          readingPreferences: {}, // Default empty preferences
        },
      });
      return NextResponse.json(newProfile.readingPreferences);
    }

    return NextResponse.json(profile.readingPreferences);
  } catch (error) {
    console.error('Get reading preferences error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const preferences = await req.json();

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: { readingPreferences: preferences },
      create: {
        userId,
        readingPreferences: preferences,
      },
    });

    return NextResponse.json(updatedProfile.readingPreferences);
  } catch (error) {
    console.error('Update reading preferences error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
