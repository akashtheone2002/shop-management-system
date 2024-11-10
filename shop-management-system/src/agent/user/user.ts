import { User } from "@/type/user/user";
import { verifyUsernamePassword } from "../../../prisma/user";

export async function login(username: string, password: string): Promise<User> {
    return await verifyUsernamePassword(username, password);
}