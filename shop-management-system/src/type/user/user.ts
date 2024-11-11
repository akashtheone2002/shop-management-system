import { Base } from "../Base";

export interface User extends Base{
    username?: string;
    name?: string;
    role?:string;
}

export enum Role{
    ADMIN,
    EMPLOYEE
}

export interface ICustomer{
    customerId?: string;
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
}