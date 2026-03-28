import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Auto-fix Neon database connection string for Vercel Serverless environments 
// to prevent "Prepared statement does not exist" crashes.
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes("neon.tech") && dbUrl.includes("pooler") && !dbUrl.includes("pgbouncer=true")) {
  dbUrl += dbUrl.includes("?") ? "&pgbouncer=true&connection_limit=1" : "?pgbouncer=true&connection_limit=1";
}

export const db = globalForPrisma.prisma ?? new PrismaClient(
  dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined
);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
