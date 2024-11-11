import { Base } from "../Base";
import { ICustomer } from "../user/user";

export interface IOrder{
    orderId?: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?:string;
}

export interface ITransaction extends Base{
    transactionId?: string;
    customer: ICustomer;
    boughtOn?: Date;
    totalPrice?: number;
    orders: IOrder[];
}