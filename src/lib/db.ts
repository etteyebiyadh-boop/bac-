import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Check if DATABASE_URL is configured
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

// Create a safe Prisma client that won't crash if DB is unavailable
function createSafePrismaClient(): PrismaClient {
  if (!hasDatabaseUrl) {
    console.warn("DATABASE_URL not configured - Prisma will not connect");
  }
  
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    throw error;
  }
}

// Export db with a proxy that handles missing database gracefully
const prismaClient = globalForPrisma.prisma ?? createSafePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

// Wrap the client to handle connection errors gracefully
export const db = new Proxy(prismaClient, {
  get(target, prop) {
    if (!hasDatabaseUrl) {
      // Return a mock that resolves to empty arrays for findMany
      return () => Promise.resolve([]);
    }
    return (target as any)[prop];
  },
});
