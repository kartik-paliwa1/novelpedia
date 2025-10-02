import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check total number of users
    const userCount = await prisma.user.count();
    
    // Get first few users (without passwords)
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ 
      userCount,
      users,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ message: 'Error fetching data', error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Create a test user for debugging
    const testEmail = 'test@example.com';
    const testUsername = 'testuser';
    const testPassword = 'password123';

    // Check if test user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: testEmail },
          { username: testUsername },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'Test user already exists',
        user: {
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        username: testUsername,
        passwordHashed: hashedPassword,
        role: 'WRITER',
      },
    });

    return NextResponse.json({ 
      message: 'Test user created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      credentials: {
        email: testEmail,
        username: testUsername,
        password: testPassword,
      }
    });
  } catch (error) {
    console.error('Test user creation error:', error);
    return NextResponse.json({ message: 'Error creating test user', error: error.message }, { status: 500 });
  }
}