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
  console.log('📦 Reorder chapters API called')
  
  const userId = await getUserIdFromToken(req);
  console.log('👤 User ID:', userId)
  
  if (!userId) {
    console.log('❌ Unauthorized - no user ID')
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { novelId, chapterOrders } = await req.json();
    console.log('📋 Request data:', { novelId, chapterOrders })

    if (!novelId || !Array.isArray(chapterOrders)) {
      console.log('❌ Invalid request data')
      return NextResponse.json({ 
        message: 'Missing required fields: novelId and chapterOrders array' 
      }, { status: 400 });
    }

    // Check if the user is the author of the novel
    const novel = await prisma.novel.findUnique({
      where: { id: novelId },
    });

    if (!novel || novel.authorId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Validate that all chapters belong to this novel
    const chapterIds = chapterOrders.map((item: any) => item.id);
    const chapters = await prisma.chapter.findMany({
      where: {
        id: { in: chapterIds },
        novelId
      }
    });

    if (chapters.length !== chapterIds.length) {
      return NextResponse.json({ 
        message: 'Some chapters do not belong to this novel' 
      }, { status: 400 });
    }

    // Update chapter orders in a transaction
    console.log('🔄 Updating chapter orders...')
    const updatePromises = chapterOrders.map((item: { id: string, order: number }) => {
      console.log(`  📝 Updating chapter ${item.id} to order ${item.order}`)
      return prisma.chapter.update({
        where: { id: item.id },
        data: { order: item.order } as any
      })
    });

    await prisma.$transaction(updatePromises);
    console.log('✅ Chapter order updated successfully')

    return NextResponse.json({ message: 'Chapter order updated successfully' });
  } catch (error) {
    console.error('❌ Reorder chapters error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}