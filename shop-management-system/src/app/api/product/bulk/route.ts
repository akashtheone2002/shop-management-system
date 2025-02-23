import { NextResponse } from 'next/server';
import { IProduct } from '@/types/apiModels/apiModels';
import { addProduct, bulkUploadProducts } from '../../../../../agents/ims';

export async function POST(request: Request) {
    try {
        const product: IProduct[] = await request.json();
        console.log("Received product for add:", product);

        const products = await bulkUploadProducts(product);
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error handling add product request:", error);
        return NextResponse.json({ error: "An error occurred while bulk adding the product" }, { status: 500 });
    }
}