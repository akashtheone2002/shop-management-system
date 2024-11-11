import getReccomendations from '@/agent/recomendation/recomendation';
import { IOrder, IProduct } from '@/type';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const products: IOrder[] = await request.json();
        let list: Array<IProduct> = await getReccomendations(products);
        if(!list || list.length <1){
            console.log("Error occured");
            list = [];
        }
        return NextResponse.json(list);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}