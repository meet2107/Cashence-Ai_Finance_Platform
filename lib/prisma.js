import { PrismaClient } from '@prisma/client'

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production'){
    globalThis.prisma = db;
}

// globalThis.prisma -> This is a global variable that holds the PrismaClient instance. So for every
// reload no new client is formed