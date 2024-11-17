import placeTransaction from "@/agent/order/order";
import { ICustomer, IOrder } from "@/type";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orders, customer }: { orders: IOrder[], customer: ICustomer } = await request.json();
    console.log("Received orders:", orders);
    console.log("Received customer:", customer);
    
    const transaction = await placeTransaction(orders, customer);
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ error: "An error occurred while adding the transaction" }, { status: 500 });
  }
}

