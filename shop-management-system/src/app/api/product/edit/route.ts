// /api/product/edit.ts
import { NextResponse } from 'next/server';
import { updatedProduct } from '@/agent/product/product'; // Adjust the import path as necessary
import { IProduct } from '@/type/product/product';

export async function POST(request: Request) {
    try {
        debugger;
        const product: IProduct = await request.json(); // Get the product from the request body
        console.log("Received product for update:", product); // Log the received product

        const products = await updatedProduct(product); // Call the update function
        return NextResponse.json(products); // Return the updated product
    } catch (error) {
        console.error("Error handling edit product request:", error); // Log the error for debugging
        return NextResponse.json({ error: "An error occurred while editing the product" }, { status: 500 });
    }
}
