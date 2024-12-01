import { NextResponse } from 'next/server';
import { IProduct } from '@/type/product/product';
import { addingProduct, bulkUploadProducts } from '@/agent/product/product';

export async function POST(request: Request) {
    try {
        debugger;
        const product: IProduct[] = await request.json();
        console.log("Received product for add:", product);

        const products = await bulkUploadProducts(product);
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error handling add product request:", error);
        return NextResponse.json({ error: "An error occurred while adding the product" }, { status: 500 });
    }
}

