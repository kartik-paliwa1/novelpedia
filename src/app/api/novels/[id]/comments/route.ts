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

type CommentEntity = Awaited<ReturnType<typeof prisma.comment.findMany>>[number];

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

export async function POST(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const novelId = params.id;
    const { content, parentId } = await req.json();

    if (!content) {
      return NextResponse.json({ message: 'Missing content field' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        novelId,
        content,
        parentId,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

interface CommentWithReplies extends CommentEntity {
  user: {
    username: string;
    profile: { avatarUrl: string | null } | null;
  };
  replies: CommentWithReplies[];
}

export async function GET(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  if (!params) {
    return NextResponse.json({ message: 'Missing route params' }, { status: 400 });
  }

  try {
    const novelId = params.id;

    const comments = await prisma.comment.findMany({
      where: { novelId },
      include: {
        user: {
          select: {
            username: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const commentMap = new Map<string, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    comments.forEach((comment) => {
      const commentWithReplies = {
        ...comment,
        replies: [],
      } as CommentWithReplies;

      commentMap.set(comment.id, commentWithReplies);

      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        } else {
          // In case parent is not in the map yet (e.g. out of order), add to root for now
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return NextResponse.json(rootComments);
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
