import { NextResponse } from 'next/server';
import { IProduct } from '@/types/apiModels/apiModels';
import { searchProduct } from '../../../../../agents/ims';

export async function GET(request: Request) {
    try {
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search');
        const response = await searchProduct(searchTerm || "");
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
