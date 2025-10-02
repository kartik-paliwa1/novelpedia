import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, type Prisma, NovelStatus } from '@prisma/client';

const prisma = new PrismaClient();

const allowedStatuses = new Set(['DRAFT', 'PUBLISHED', 'HIATUS', 'COMPLETED']);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre');
    const tags = searchParams.getAll('tag');
    const status = searchParams.get('status');

    const filters: Prisma.NovelWhereInput[] = [];

    if (genre) {
      filters.push({
        genre,
      });
    }

    if (tags.length > 0) {
      const tagFilters = tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map<Prisma.NovelWhereInput>((tag) => ({
          tags: {
            contains: tag,
          },
        }));

      filters.push(...tagFilters);
    }

    if (status && allowedStatuses.has(status)) {
      filters.push({
        status: status as NovelStatus,
      });
    }

    const where: Prisma.NovelWhereInput = filters.length > 0 ? { AND: filters } : {};

    const novels = await prisma.novel.findMany({
      where,
      include: {
        author: {
            select: {
                username: true
            }
        }
      }
    });

    return NextResponse.json(novels);
  } catch (error) {
    console.error('Filter novels error:', error);
    if (error instanceof Error && error.message.includes("hasSome")) {
        return NextResponse.json({ message: "The current database provider does not support hasSome filter. Please use a single tag parameter." }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
