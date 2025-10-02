import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHashed: hashedPassword,
        role: 'READER', // Set default role for authors dashboard
      },
    });

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    // Check for unique constraint violation
    if (error instanceof Error && 'code' in error && (error as { code: string; meta?: { target: string[] } }).code === 'P2002') {
        const target = (error as { code: string; meta?: { target: string[] } }).meta?.target;
        if (target?.includes('email')) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
        }
        if (target?.includes('username')) {
            return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
        }
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
