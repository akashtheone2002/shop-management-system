import { NextResponse } from 'next/server';
import { downloadTransactions } from '../../../../../agents/oms';

export async function GET() {
    try {
        const success = await downloadTransactions();
        return NextResponse.json(success);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

