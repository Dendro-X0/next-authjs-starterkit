/**
 * Prisma seed script.
 * Uses DATABASE_URL from environment.
 * Replace the contents of main() with your app-specific inserts.
 */
import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

async function main(): Promise<void> {
  // Example: health check
  await prisma.$executeRaw`SELECT 1`
}

main()
  .then(async (): Promise<void> => {
    await prisma.$disconnect()
    console.log('Seed complete')
  })
  .catch(async (err: unknown): Promise<void> => {
    await prisma.$disconnect()
    const msg: string = err instanceof Error ? err.message : String(err)
    console.error('Seed failed:', msg)
    process.exit(1)
  })
