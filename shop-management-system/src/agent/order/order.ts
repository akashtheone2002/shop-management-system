import { getSession } from "@/app/lib/session";
import { IOrder, ICustomer, ITransaction } from "@/type";

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
  const session: IUser = await getSession();
  const id = session.id;
  
  return result;
}
