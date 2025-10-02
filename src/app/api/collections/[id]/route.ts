import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

type RouteContext = {
  params?: Promise<{
    id: string;
  }>;
};

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

export async function GET(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  try {
    const collectionId = params.id;
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        novels: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Get collection error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const collectionId = params.id;
    const { name, description, novelIds } = await req.json();

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    if (collection.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        name,
        description,
        novels: novelIds ? { set: novelIds.map((id: string) => ({ id })) } : undefined,
      },
    });

    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error('Update collection error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const collectionId = params.id;

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    if (collection.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.collection.delete({
      where: { id: collectionId },
    });

    return NextResponse.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Delete collection error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
