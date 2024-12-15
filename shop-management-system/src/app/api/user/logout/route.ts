import { deleteSession } from "@/app/lib/session";

export async function GET() {
    await deleteSession();
    return true;
}