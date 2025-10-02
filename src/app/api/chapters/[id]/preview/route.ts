import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (content === undefined) {
      return NextResponse.json({ message: 'Missing content field' }, { status: 400 });
    }

    const preview = content.substring(0, 200) + (content.length > 200 ? '...' : '');

    return NextResponse.json({ preview });
  } catch (error) {
    console.error('Preview generation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
