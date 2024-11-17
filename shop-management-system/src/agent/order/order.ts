import { getSession } from "@/app/lib/session";
import { IOrder, ICustomer, ITransaction, User } from "@/type";
import { addTransaction, getTransactionById, getTransactionHistory } from "../../../prisma/orders";
import { Transaction, TransactionHistoryParams, TransactionHistoryResponse } from "@/type/transaction/transaction";

export default async function placeTransaction(orders: IOrder[], customer: ICustomer) {
  // Calculate total price
  const totalPrice = orders.reduce((total, order) => total + order.price * order.quantity, 0);

  // Create transaction object
  const transaction: ITransaction = {
    customer,
    orders,
    totalPrice,
    boughtOn: new Date(),
  };
  const session = await getSession();
  const id = String(session?.id || "");
  transaction.boughtOn = new Date();
  transaction.modifiedBy = id;
  const result = addTransaction(transaction)
  return result;
}

export async function fetchTransactionHistoryAgent(
  params: TransactionHistoryParams
): Promise<TransactionHistoryResponse> {
  try {
    // Call the service function with parameters
    const history = await getTransactionHistory(params);
    return history;
  } catch (error) {
    console.error("Error in Agent fetching transaction history:", error);
    throw new Error("Failed to fetch transaction history.");
  }
}

export async function fetchTransactionByIdAgent(id: string){
  return getTransactionById(id);
}