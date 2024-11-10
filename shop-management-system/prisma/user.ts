import { User as UserType } from '@/type/user/user';
import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

export async function verifyUsernamePassword(username: string, password: string): Promise<UserType> {
    const user: User | null = await prisma.user.findFirst({
        where: {
            email: username,
            password: password,
        },
    });
    if (!user) {
        return { error: 'User not found.', hasError: true };
    }
    return {username: user.email, role: user.role.toString(), name: user.name, hasError: false};
}