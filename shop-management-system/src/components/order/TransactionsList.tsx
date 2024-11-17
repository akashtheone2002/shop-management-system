"use client"
import { TransactionEntry, TransactionHistoryResponse } from '@/type/transaction/transaction';
import React, { useState, useEffect } from 'react';

const dummyData: TransactionHistoryResponse = {
    "transactions": [
      {
        "transactionId": "txn12345",
        "boughtBy": "John Doe",
        "boughtOn": new Date("2024-11-18T10:30:00Z")
      },
      {
        "transactionId": "txn12346",
        "boughtBy": "Jane Smith",
        "boughtOn": new Date("2024-11-17T14:20:00Z")
      },
      {
        "transactionId": "txn12347",
        "boughtBy": "Tom Johnson",
        "boughtOn": new Date("2024-11-16T09:15:00Z")
      }
    ],
    "metadata": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 9,
      "limit": 3
    }
  }
  
const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'boughtOn' | 'customerName'>('boughtOn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, search, sortBy, sortOrder]);

//   const fetchTransactions = async () => {
//     try {
//       const response = await fetch(
//         `/api/transactions?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
//       );
//       if (response.ok) {
//         const data: TransactionHistoryResponse = await response.json();
//         setTransactions(data.transactions);
//         setTotalPages(data.metadata.totalPages);
//       } else {
//         console.error('Failed to fetch transactions');
//       }
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//     }
//   };
  const fetchTransactions = async () => {
    setTransactions(dummyData.transactions);
    setTotalPages(dummyData.metadata.totalPages);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handleSortChange = (field: 'boughtOn' | 'customerName') => {
    const order = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(order);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const getTransaction = (transactionId: string) => {
    console.log(transactionId);
  }

  return (
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
      <table>
        <thead>
          <tr>
            <th>Transaction Id</th>
            <th onClick={() => handleSortChange('boughtOn')}>
              Bought On {sortBy === 'boughtOn' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSortChange('customerName')}>
              Customer Name {sortBy === 'customerName' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transactionId}>
              <td>{transaction.transactionId}</td>
              <td>{new Date(transaction.boughtOn).toLocaleDateString()}</td>
              <td>{transaction.boughtBy}</td>
              <td><a onClick={() => getTransaction(transaction.transactionId)}>View</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
      <div>
        <label>
          Items per page:
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default TransactionHistory;
