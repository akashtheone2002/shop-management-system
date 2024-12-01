import { bulkUploadOrder } from "@/agent/order/order";
import { ITransaction } from "@/type";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const transactions: ITransaction = await request.json();
    console.log("Received orders:", transactions);
    
    const success = await bulkUploadOrder(transactions);
    return NextResponse.json(success);
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ error: "An error occurred while adding the transaction" }, { status: 500 });
  }
}

