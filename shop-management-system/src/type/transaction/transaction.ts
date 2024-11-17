export interface TransactionHistoryResponse {
  transactions: TransactionEntry[];
  metadata: PaginationMetadata;
}

export interface TransactionEntry {
  transactionId: string; // Unique ID of the transaction
  boughtBy: string; // Name of the customer who made the purchase
  boughtOn: Date; // Date of purchase
}

export interface PaginationMetadata {
  currentPage: number; // Current page number
  totalPages: number; // Total number of pages
  totalRecords: number; // Total number of records matching the query
  limit: number; // Number of records per page
}

export interface TransactionHistoryParams {
    page?: number; // Page number (default: 1)
    limit?: number; // Number of entries per page (default: 10)
    search?: string; // Search term for customer name or email
    sortBy?: "boughtOn" | "customerName"; // Sort by field (default: "boughtOn")
    sortOrder?: "asc" | "desc"; // Sort order (default: "desc")
  }

  export interface Transaction {
    id: string; // Unique ID of the transaction
    customerId: string; // ID of the customer who made the purchase
    boughtOn: Date; // Date of purchase
    totalPrice: number; // Total price of the transaction
    orders: Order[]; // List of orders in this transaction
    customer: Customer; // Customer information
  }
  
  export interface Order {
    id: string; // Unique ID of the order
    productId: string; // ID of the product
    quantity: number; // Quantity of the product ordered
    price: number; // Price of the product in the order
    product: Product; // Product details associated with this order
  }
  
  export interface Product {
    id: string; // Unique ID of the product
    name: string; // Name of the product
    price: number; // Price of the product
  }
  
  export interface Customer {
    id: string; // Unique ID of the customer
    name: string; // Name of the customer
    email?: string; // Email of the customer (optional)
    number?: string; // Phone number of the customer (optional)
  }
  