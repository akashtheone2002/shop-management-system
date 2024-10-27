
import { productList } from '@/agent/product/product';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await productList();
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

