import { NextResponse } from "next/server";
import placeTransaction from "../../../../agents/oms";
import { ICustomer, IOrder, ITransaction } from "@/types/apiModels/apiModels";
import { getSessionUserName } from "@/app/lib/session";

export async function POST(request: Request) {
  try {
    const { orders, customer, totalPrice }: { orders: IOrder[], customer: ICustomer, totalPrice: number } = await request.json();
    console.log("Received orders0:", orders);
    console.log("Received customer:", customer);
    
    const transaction: ITransaction = await placeTransaction(orders, customer, totalPrice);
    transaction.user = { name: await getSessionUserName()};
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ error: "An error occurred while adding the transaction" }, { status: 500 });
  }
}

