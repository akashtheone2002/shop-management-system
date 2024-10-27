import { deleteSession } from "@/app/lib/session";

export async function GET(username: string, password: string) {
    await deleteSession();
    return true;
}