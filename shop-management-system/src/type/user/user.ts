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