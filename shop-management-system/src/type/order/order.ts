import { Base } from "../Base";

export interface ICustomer {
    customerId?: string;
    name?: string;
    email?: string;
    phone?: string;
  }
  
  export interface IOrder {
    orderId?: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }
  
  export interface ITransaction extends Base {
    transactionId?: string;
    customer: ICustomer;
    boughtOn?: Date;
    totalPrice?: number;
    orders: IOrder[];
    modifiedBy?: string; // User ID who modified the transaction
    modifiedOn?: Date; // Date when the transaction was modified
  }
  