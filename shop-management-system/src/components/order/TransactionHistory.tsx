"use client";
import {
  Order,
  TransactionEntry,
  TransactionHistoryResponse,
} from "@/type/transaction/transaction";
import React, { useState, useEffect } from "react";
import Alert from "../common/Alert";
import TableWithControls from "../common/TableWithControls";

const dummyData: TransactionHistoryResponse = {
  transactions: [
    {
      transactionId: "txn12345",
      boughtBy: "John Doe",
      boughtOn: new Date("2024-11-18T10:30:00Z"),
    },
    {
      transactionId: "txn12346",
      boughtBy: "Jane Smith",
      boughtOn: new Date("2024-11-17T14:20:00Z"),
    },
    {
      transactionId: "txn12347",
      boughtBy: "Tom Johnson",
      boughtOn: new Date("2024-11-16T09:15:00Z"),
    },
  ],
  metadata: {
    currentPage: 1,
    totalPages: 3,
    totalRecords: 9,
    limit: 3,
  },
};

const dummyOrders: Record<string, Order[]> = {
  txn12345: [
    {
      id: "order1",
      productId: "prod1",
      quantity: 2,
      price: 10.0,
      product: { id: "prod1", name: "Product A", price: 10.0 },
    },
    {
      id: "order2",
      productId: "prod2",
      quantity: 1,
      price: 20.0,
      product: { id: "prod2", name: "Product B", price: 20.0 },
    },
  ],
  txn12346: [
    {
      id: "order3",
      productId: "prod3",
      quantity: 5,
      price: 5.0,
      product: { id: "prod3", name: "Product C", price: 5.0 },
    },
    {
      id: "order4",
      productId: "prod4",
      quantity: 3,
      price: 15.0,
      product: { id: "prod4", name: "Product D", price: 15.0 },
    },
  ],
  txn12347: [
    {
      id: "order5",
      productId: "prod5",
      quantity: 1,
      price: 100.0,
      product: { id: "prod5", name: "Product E", price: 100.0 },
    },
    {
      id: "order6",
      productId: "prod6",
      quantity: 2,
      price: 50.0,
      product: { id: "prod6", name: "Product F", price: 50.0 },
    },
  ],
};

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [alertProps, setAlertProps] = useState<{
    success: boolean;
    text: string;
    duration: number;
  } | null>(null);

  const fetchTransactions = async (
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string|number|null,
    sortOrder?: "desc" | "asc" | null
  ) => {
    // Commented out the actual API call for now.
    // const response = await fetch(
    //   `/api/history?page=${page}&limit=${pageSize}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    // );
    // if (!response.ok) {
    //   throw new Error(`Error fetching transactions: ${response.status}`);
    // }
    // const data = await response.json();
    // setTransactions(data.transactions);
    // setTotalPages(data.metadata.totalPages);

    // Using dummy data for now
    setTransactions(dummyData.transactions);
  };

  const getTransactionOrders = async (transactionId: string) => {
    // Simulate fetching orders for the transaction
    const ordersResponse = dummyOrders[transactionId] || [];
    setOrders(ordersResponse);
  };

  const handleReturn = async (orderId: string) => {
    const response = await fetch(`/api/order/return?orderId=${orderId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch orders. Status: ${response.status}`);
    }

    // Parse the JSON response
    const success = await response.json();
    setShowAddModal(false);
    if (success) {
      console.log("Order returned successfully");
      // Refresh the transaction history page
      getTransaction(orderId);

      setAlertProps({
        success: true,
        text: "Order returned successfully!",
        duration: 5,
      });
    }

    setAlertProps({
      success: false,
      text: "Failed to return the order. Please try again.",
      duration: 5,
    });
  };

  const getTransaction = async (
    transactionId: string,
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      console.log(`Fetching orders for transaction ID: ${transactionId}`);

      // // Fetch orders for the given transaction ID
      // const response = await fetch(`/api/getOrdersForTransaction?transactionId=${transactionId}`);

      // if (!response.ok) {
      //   throw new Error(`Failed to fetch orders. Status: ${response.status}`);
      // }

      // // Parse the JSON response
      // const ordersResponse = (await response.json()) as Order[];

      // Simulate fetching orders from dummy data
      const ordersResponse = dummyOrders[transactionId] || [];

      // Update state with fetched orders
      setOrders(ordersResponse);

      // Toggle the modal visibility
      setShowAddModal(true);
    } catch (error) {
      console.error("Error fetching transaction orders:", error);
      // Optionally, display an error message to the user
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const transactionColumns = [
    { header: "Transaction Id", accessor: "transactionId" },
    { header: "Bought On", accessor: "boughtOn" },
    { header: "Customer Name", accessor: "boughtBy" },
  ];

  const ordersColumns = [
    { header: "Product Name", accessor: "product.name" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Price", accessor: "price" },
  ];

  return (
    <>
      {alertProps && <Alert {...alertProps} />}

      <div>
        <h1>Transaction History</h1>
        <TableWithControls
          columns={transactionColumns}
          fetchData={async ({
            page,
            pageSize,
            search,
            sortBy,
            sortOrder,
          }) => {
            // Implement the API call for transaction history once ready
            return 
              await fetchTransactions(page,
                pageSize,
                search,
                sortBy,
                sortOrder);
            ;
          }}
          pageSizeOptions={[5, 10, 20]}
          defaultPageSize={10}
          onRowAction={(transaction) => (
            <button
              onClick={() => getTransactionOrders(transaction.transactionId)}
            >
              View Orders
            </button>
          )}
        />
        {showAddModal && orders && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                // Close the modal if the click is on the overlay (not the modal content)
                if (e.target === e.currentTarget) {
                  setShowAddModal(false);
                }
              }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Order List
                </h3>
                <TableWithControls
                  columns={ordersColumns}
                  fetchData={async ({
                    page,
                    pageSize,
                    search,
                    sortBy,
                    sortOrder,
                  }) => {
                    // Implement the API call for order list once ready
                    return await getTransaction(transactionId,
                        page,
                        pageSize,
                        search,
                        sortBy,
                        sortOrder);;
                  }}
                  pageSizeOptions={[5, 10, 20]}
                  defaultPageSize={10}
                  onRowAction={(order) => (
                    <button onClick={() => handleReturn(order.id)}>
                      Return Order
                    </button>
                  )}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TransactionHistory;
