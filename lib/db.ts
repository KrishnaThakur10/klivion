import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function makePrisma() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Cap connections per serverless instance.
    // Supabase session mode allows 15 total — with multiple Vercel
    // function instances running concurrently, keep this low (1–2).
    max: 1,
    // Close idle connections quickly so they don't pile up
    idleTimeoutMillis: 10_000,
    // Don't wait forever if pool is exhausted — fail fast
    connectionTimeoutMillis: 5_000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

// Reuse across hot reloads in dev AND across invocations in production.
// The missing `production` guard was the root cause of connection exhaustion.
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = makePrisma()
}

export const db = globalForPrisma.prisma