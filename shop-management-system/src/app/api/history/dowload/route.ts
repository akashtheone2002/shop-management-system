import { downloadHistory } from '@/agent/order/order';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const success = await downloadHistory();
        return NextResponse.json(success);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

