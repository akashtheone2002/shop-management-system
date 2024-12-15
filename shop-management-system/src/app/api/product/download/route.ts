import { NextResponse } from "next/server";

export async function GET() {
    try {
        
        return NextResponse.json(true);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
