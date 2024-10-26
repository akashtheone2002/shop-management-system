
import { NextResponse } from 'next/server';
import { createProduct, getProducts } from '../../../../prisma/product';

export async function GET() {
    try {
        // const response = await createProduct("maggi", 200, 14.0, "tasty", "sample.jpg", "food");
        const response = await getProducts();
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

