import { NextResponse } from 'next/server';
import { processTransactionsForAssociationRules } from '../../../../../agents/pps';
export async function GET(request: Request) {
    try {
        processTransactionsForAssociationRules();
        return NextResponse.json(true);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
