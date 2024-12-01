import { fetchTransactionByIdAgent, returnOrder } from '@/agent/order/order';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
   // Extract the ID from the request URL
   // Extract query parameters from the request URL
   const url = new URL(req.url);
   const id = url.searchParams.get('orderId') || '';
    try {
      console.log(id);
    if (!id) {
      return NextResponse.json({ error: 'Invalid or missing transaction ID' }, { status: 400 });
    }

    // Fetch the transaction using the agent function
    const success = await returnOrder(id);

    // Return the transaction as JSON
    return NextResponse.json(success);
  } catch (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
