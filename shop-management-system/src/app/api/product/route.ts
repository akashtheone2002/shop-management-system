import { NextResponse } from 'next/server';
import { addProduct, deleteProduct, productList, updateProduct } from '../../../../agents/ims';

export async function GET(request: Request) {
    try {
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const sort =  searchParams.get('sort') || 'modifiedOn';
        const order =  searchParams.get('order');
        const orderParam = order === "desc" || order === "asc" ? order : "desc";
        const page = Number(searchParams.get('page')) || 1;
        const pageSize= Number(searchParams.get('pageSize')) || 10;
        const response = await productList(search, sort, orderParam, page, pageSize);
        
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        debugger;
        const product: IProduct = await request.json();
        console.log("Received product for add:", product);

        const products = await addProduct(product);
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error handling add product request:", error);
        return NextResponse.json({ error: "An error occurred while adding the product" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const response = await deleteProduct(String(id));
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const product: IProduct = await request.json(); // Get the product from the request body
        console.log("Received product for update:", product); // Log the received product

        const products = await updateProduct(product); // Call the update function
        return NextResponse.json(products); // Return the updated product
    } catch (error) {
        console.error("Error handling edit product request:", error); // Log the error for debugging
        return NextResponse.json({ error: "An error occurred while editing the product" }, { status: 500 });
    }
}

