import { NextResponse } from 'next/server';
import getReccomendations, { processTransactionsForAssociationRules } from '../../../../agents/pps';
import { IOrder, IProduct } from '@/types/apiModels/apiModels';

export async function POST(request: Request) {
    try {
        const cartItems: IOrder[] = await request.json();
        let list: Array<IProduct> = await getReccomendations(cartItems);
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

export async function GET() {
    try {
        await processTransactionsForAssociationRules();
        return NextResponse.json(true);
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}