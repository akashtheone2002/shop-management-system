import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export function verifyUsernamePassword(username: string, password: string){
    const result = prisma
}