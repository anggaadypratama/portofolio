import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
const adapter = new PrismaPg(pool)

// If we are in dev and the global prisma exists but is missing the tool or education model (added later),
// we MUST clear it to pick up the new model getters.
if (process.env.NODE_ENV !== 'production' && (globalThis as any).prisma && (!(globalThis as any).prisma.tool || !(globalThis as any).prisma.education)) {
  console.log('DEBUG: Global prisma missing "tool" or "education" model. Clearing for recreation...');
  (globalThis as any).prisma = undefined;
}

const p = (globalThis as any).prisma || new PrismaClient({ adapter, log: ['query', 'error', 'warn'] });

// Double check if this instance actually has it. If not, don't use it as singleton.
if ((!p.tool || !p.education) && process.env.NODE_ENV !== 'production') {
   console.log('DEBUG: Newly created client also missing tool or education! Caching issue persists.');
}

export const prisma = p;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
