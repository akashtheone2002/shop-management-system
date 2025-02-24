// Adjust the import based on your file structure
import { getSession } from "@/app/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ success: false, user: null });
        }
        return NextResponse.json({ success: true, user: session });
    } catch (error) {
        console.error("Error fetching session:", error);
        return NextResponse.json({ success: false, user: null });
    }
}
