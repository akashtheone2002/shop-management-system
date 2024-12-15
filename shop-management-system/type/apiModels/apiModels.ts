interface IUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Roles;
}

interface IProduct {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  stock?: number;
  description?: string;
  category?: string;
}

interface ICustomer {
  id?: string;
  name?: string;
  email?: string;
  number?: string;
}

interface IOrder {
  id?: string;
  quantity?: number;
  price?: number;
  product?: IProduct;
}

interface ITransaction {
  id?: string;
  boughtOn?: Date;
  totalPrice?: number;
  orders?: IOrder[];
  customer?: ICustomer;
  user?: IUser;
}

interface IProductCSV {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  stock?: number;
  description?: string;
  category?: string;
  [key: string]: unknown;
}

interface ITransactionCSV {
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

interface IMetaData {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

interface IPaginationMetaData{

}

interface ITransactionList{
  transactions: ITransaction[];
  metadata: IMetaData;
}

interface ITransactionPayload {
  customer?: string;
  orders?: string[];
}

interface IFlatTransaction {
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


interface IFrequentItemset {
  itemset: string[];
  support: number;
}

interface IAssociationRule {
  antecedent: string[];
  consequent: string[];
  confidence: number;
}