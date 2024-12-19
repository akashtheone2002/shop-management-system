"use client";
import React, { useState, useEffect } from "react";
import Alert from "../common/Alert";
import Modal from "../common/Modal";
import { IOrder, ITransaction } from "@/types/apiModels/apiModels";

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [transaction, setTransaction] = useState<ITransaction>()
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"boughtOn" | "customerName">("boughtOn");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [orders, setOrders] = useState<IOrder[]>();

  const [alertProps, setAlertProps] = useState<{
    success: boolean;
    text: string;
    duration: number;
    setVisible: (visible: boolean) => void;
  } | null>({
    success: true,
    text: "",
    duration: 5,
    setVisible: () => {},
  });
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, search, sortBy, sortOrder]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `/api/history?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.status}`);
      }

      const data = await response.json();

      // Update transactions and pagination state
      setTransactions(data.transactions);
      setTotalPages(data.metadata.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handleSortChange = (field: "boughtOn" | "customerName") => {
    const order = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(order);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getTransaction = async (transactionId: string) => {
    try {
      console.log(`Fetching orders for transaction ID: ${transactionId}`);

      // Fetch orders for the given transaction ID
      const response = await fetch(`/api/history/${transactionId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders. Status: ${response.status}`);
      }

      // Parse the JSON response
      const ordersResponse = (await response.json()) as ITransaction;
      setTransaction(ordersResponse);
      // Update state with fetched orders
      setOrders(ordersResponse.orders);

      // Toggle the modal visibility
      setShowAddModal(true);
    } catch (error) {
      console.error("Error fetching transaction orders:", error);
      // Optionally, display an error message to the user
    }
  };

  const handleReturn = async (orderId: string) => {
    setAlertVisible(true);
    setAlertProps({
      success: true,
      text: "Order returned successfully!",
      duration: 5,
      setVisible: setAlertVisible,
    });
    // const response = await fetch(`/api/order/return?orderId=${orderId}`);

    // if (!response.ok) {
    //   throw new Error(`Failed to fetch orders. Status: ${response.status}`);
    // }

    // // Parse the JSON response
    // const success = (await response.json());
    // setShowAddModal(false);
    // if(success) {
    //   console.log("Order returned successfully");
    //   // Refresh the transaction history page
    //   getTransaction(orderId);
    //   setAlertVisible(true);
    //   setAlertProps({
    //     success: true,
    //     text: "Order returned successfully!",
    //     duration: 5,
    //   });
    // }
    // setAlertVisible(true);
    // setAlertProps({
    //   success: false,
    //   text: "Failed to return the order. Please try again.",
    //   duration: 5,
    // });
  };

  const donwloadCSV = () => {};

  return (
    <>
      {alertVisible && alertProps && <Alert {...alertProps} />}
      <button onClick={()=>{donwloadCSV}}>Download csv</button>
      <div>
        <h1>Transaction History</h1>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
          <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
            <tr>
              <th scope="col" className="px-6 py-4">
                Transaction Id
              </th>
              <th
                scope="col"
                className="px-6 py-4 cursor-pointer"
                onClick={() => handleSortChange("boughtOn")}
              >
                Bought On{" "}
                {sortBy === "boughtOn" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 cursor-pointer"
              >
                Customer Name{" "}
              </th>
              <th scope="col" className="px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-neutral-200 dark:border-white/10"
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium">
                  {transaction.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(transaction.boughtOn || new Date()).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {transaction.customer?.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    onClick={() => getTransaction(transaction.id || "")}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
        <div>
          <label>
            Items per page:
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
      </div>

      {showAddModal && orders && (
        <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Order List
          </h3>
          <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
            <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-4">
                  Price
                </th>
                <th scope="col" className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 && orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-neutral-200 dark:border-white/10"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {order.product?.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {order.quantity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{order.price}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      onClick={() => handleReturn(order.id || "")}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </>
  );
};

export default TransactionHistory;
