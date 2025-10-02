// Simple dev seeding script for the Next.js frontend Prisma DB
// Seeds a default user if SEED_TEST_USER=true

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

async function main() {
  const shouldSeed = (process.env.SEED_TEST_USER || 'false').toLowerCase() === 'true'
  if (!shouldSeed) {
    return
  }

  const email = process.env.SEED_USER_EMAIL || 'test@example.com'
  const password = process.env.SEED_USER_PASSWORD || 'Password123!'
  const username = process.env.SEED_USER_USERNAME || 'devuser'

  const prisma = new PrismaClient()
  try {
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username,
        passwordHashed: hashed,
        role: 'READER',
      },
    })
    // eslint-disable-next-line no-console
    console.log(`Seeded dev user: ${email} / ${password}`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Seeding error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()

