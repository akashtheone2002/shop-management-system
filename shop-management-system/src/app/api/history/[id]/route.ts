import { NextResponse } from 'next/server';
import { fetchTransactionById } from '../../../../../agents/oms';

interface Context {
  params: {
    id: string;
  };
}

export async function GET(req: Request, context: Context) {
  const { id } = context.params;
   
  try {
    console.log(id);
    if (!id) {
      return NextResponse.json({ error: 'Invalid or missing transaction ID' }, { status: 400 });
    }

    // Fetch the transaction using the agent function
    const transaction = await fetchTransactionById(id);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Return the transaction as JSON
    return NextResponse.json(transaction);
  } catch (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
