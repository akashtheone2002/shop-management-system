import placeTransaction from "@/agent/order/order";
import { IOrder } from "@/type";
import { ICustomer } from "@/type/user/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orders, customer }: { orders: IOrder[], customer: ICustomer } = await request.json();
    console.log("Received orders:", orders);
    console.log("Received customer:", customer);
    
    const products = await placeTransaction(orders, customer);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error handling add product request:", error);
    return NextResponse.json({ error: "An error occurred while adding the product" }, { status: 500 });
  }
}

