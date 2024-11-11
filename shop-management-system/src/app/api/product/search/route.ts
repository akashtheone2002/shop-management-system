import { searchProduct } from '@/agent/product/product';
import { IProduct } from '@/type/product/product';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Extract search parameters from the request URL
        const { searchParams } = new URL(request.url);
        const searchterm = searchParams.get('searchterm');
        // let list: Array<IProduct> = await searchProduct(searchterm || "");
        // if(!list || list.length <1){
        //     console.log("Error occured");
        //     list = [];
        // }
        const list: IProduct[] = [
            {
              id: "97",
              name: "Apple",
              price: 1000,
              stock: 8,
            },
            {
              id: "5669",
              name: "Grapes",
              price: 5000,
              stock: 90,
            },
          ];
        return NextResponse.json(list);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}