"use client";
import React, { useState, useEffect } from "react";
import Alert from "../common/Alert";
import Modal from "../common/Modal";
import { IOrder, ITransaction } from "@/types/apiModels/apiModels";

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [transaction, setTransaction] = useState<ITransaction>();
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
  } | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, search, sortBy, sortOrder]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `/api/history?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (!response.ok) throw new Error(`Error fetching transactions: ${response.status}`);
      const data = await response.json();
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
      const response = await fetch(`/api/history/${transactionId}`);
      if (!response.ok) throw new Error(`Failed to fetch orders. Status: ${response.status}`);
      const ordersResponse = (await response.json()) as ITransaction;
      setTransaction(ordersResponse);
      setOrders(ordersResponse.orders);
      setShowAddModal(true);
    } catch (error) {
      console.error("Error fetching transaction orders:", error);
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
  };

  const donwloadCSV = () => {
    // Download CSV logic here
  };

  return (
    <>
      {alertVisible && alertProps && <Alert {...alertProps} />}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto p-6 flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold text-gray-800">Transaction History</h1>
            <button
              onClick={donwloadCSV}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Download CSV
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <table className="min-w-full text-left text-sm font-light bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-gray-600">Transaction Id</th>
                <th
                  className="px-6 py-4 text-gray-600 cursor-pointer"
                  onClick={() => handleSortChange("boughtOn")}
                >
                  Bought On {sortBy === "boughtOn" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-gray-600">Customer Name</th>
                <th className="px-6 py-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="px-6 py-4">{transaction.id}</td>
                  <td className="px-6 py-4">{new Date(transaction.boughtOn || new Date()).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{transaction.customer?.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => getTransaction(transaction.id || "")}
                      className="text-blue-600 hover:text-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-4 text-gray-700">Page {page} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div>
              <label htmlFor="limit" className="text-gray-700">Items per page:</label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="ml-2 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && orders && (
        <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Order List</h3>
          <table className="min-w-full text-left text-sm font-light bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-gray-600">Product Name</th>
                <th className="px-6 py-4 text-gray-600">Quantity</th>
                <th className="px-6 py-4 text-gray-600">Price</th>
                <th className="px-6 py-4 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-6 py-4">{order.product?.name}</td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">{order.price}</td>
                  <td className="px-6 py-4">
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
