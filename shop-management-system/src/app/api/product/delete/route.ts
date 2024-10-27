import { NextResponse } from 'next/server';
import { deletedProduct } from '@/agent/product/product';

export async function GET(request: Request) {
    try {
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const response = await deletedProduct(String(id));
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
