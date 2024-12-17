import { Roles } from "../entity/entity";

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Roles;
}

export interface IProduct {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  stock?: number;
  description?: string;
  category?: string;
}

export interface ICustomer {
  id?: string;
  name?: string;
  email?: string;
  number?: string;
}

export interface IOrder {
  id?: string;
  quantity?: number;
  price?: number;
  product?: IProduct;
}

export interface ITransaction {
  id?: string;
  boughtOn?: Date;
  totalPrice?: number;
  orders?: IOrder[];
  customer?: ICustomer;
  user?: IUser;
}

export interface IProductCSV {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  stock?: number;
  description?: string;
  category?: string;
  [key: string]: unknown;
}

export interface ITransactionCSV {
  name?: string;
  quantity?: number;
  customerName?: string;
  number?: string;
  email?: string;
  boughtOn?: Date;
  pricePerUnit?: number;
  totalPrice?: number;
  [key: string]: unknown;
}

export interface IMetaData {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface ITransactionList{
  transactions: ITransaction[];
  metadata: IMetaData;
}

export interface ITransactionPayload {
  customer?: string;
  orders?: string[];
}

export interface IFlatTransaction {
  id?: string;
  boughtOn?: Date;
  totalPrice?: number;
  
  customerName?: string;
  customerEmail?: string;
  customerNumber?: string;

  userName?: string;

  // Orders fields (flattened for the first product, assuming a single order for simplicity)
  orderQuantity?: number;
  orderPrice?: number;
  productName?: string;
  productPrice?: number;
}


export interface IFrequentItemset {
  itemset: string[];
  support: number;
}

export interface IAssociationRule {
  antecedent: string[];
  consequent: string[];
  confidence: number;
}