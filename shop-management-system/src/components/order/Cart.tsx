"use client";
import React, { useState } from "react";
import CartProductList from "./CartProductList";
import SearchProduct from "./SearchProduct";
import Reccomendations from "./Reccomendation";
import Modal from "../common/Modal";
import Uploader from "../common/Uploader";
import { ICustomer, IOrder, IProduct, ITransaction, ITransactionCSV } from "@/types/apiModels/apiModels";
import { Receipt } from "./Receipt";
const demoOrders: IOrder[] = [];
const Cart = () => {
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showBulkUploadModal, setShowBulkUploadModall] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModall] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<ITransaction>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [customer, setCustomer] = useState<ICustomer>({
    name: "",
    email: "",
    number: "",
  });

  const subtotal = orders.reduce(
    (acc, product) => acc + (product.product?.price || 1) * (product.quantity || 1),
    0
  );

  const taxes = subtotal * 0.1; 
  const total = subtotal + taxes;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    // Reset the form if cancel is clicked
    setShowAddModal(false);

    setCustomer({
      name: "",
      email: "",
      number: "",
    });
  };

  const handleIncrease = (index: number) => {
    const newProducts = [...orders];
    const existingProductId = newProducts[index].product?.id;
    const existingProduct = products.find((product) => product.id === existingProductId);

    if (existingProduct && existingProduct?.stock <= newProducts[index]?.quantity) {
      alert("Product is out of stock");
      return;
    }
    newProducts[index].quantity = (newProducts[index].quantity || 0) + 1 ;
    newProducts[index].price = (newProducts[index].quantity || 1) * (newProducts[index].price || 1);
    setOrders(newProducts);
  };

  const handleDecrease = (index: number) => {
    const newProducts = [...orders];
    if ((newProducts[index].quantity || 0) > 1) {
      newProducts[index].quantity = (newProducts[index].quantity || 0) - 1;
      newProducts[index].price = (newProducts[index].quantity || 1) * (newProducts[index].price || 1);
      setOrders(newProducts);
    }
  };

  const handleRemove = (index: number) => {
    const newProducts = orders.filter((_, i) => i !== index);
    setOrders(newProducts);
  };

  const handleAddProduct = (product: IProduct) => {
    const existingProductIndex = orders.findIndex(
      (p) => p.product?.id === product.id
    );
    if (existingProductIndex > -1) {
      const newProducts = [...orders];
      if(product.stock == newProducts[existingProductIndex].quantity) {
        alert("Product is out of stock");
        return;
      }
      newProducts[existingProductIndex].quantity =  (newProducts[existingProductIndex].quantity || 0) + 1;
      setOrders(newProducts);
    } else {
      if(product.stock == 0) {
        alert("Product is out of stock");
        return;
      }
      setOrders([
        ...orders,
        {
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "",
          },
          price: product.price,
          quantity: 1,
        },
      ]);
    }
    const newProducts = [...products, product];
    setProducts(newProducts)
  };

  const checkOut = async () => {
    console.log(orders);
    console.log(customer);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders, customer, total }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: ITransaction = await response.json();
      console.log("After placing order.",result);
      setTransaction(result);
      setShowAddModal(false);
      setShowReceiptModall(true);
      console.log("Order placed successfully:", result);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const parseData = (data: ITransactionCSV[]): ITransaction => {
    const today = new Date();
  
    // Calculate total price by summing up the prices from the input data
    const total = data.reduce((sum, transaction) => {
      return sum + (transaction.totalPrice || 0);
    }, 0);
  
    // Construct orders array
    const orders: IOrder[] = data.map(item => ({
      product: {
        name: item.name,
      },
      quantity: item.quantity || 0,
    }));
  
    // Construct customer data (assuming the customer is the same for all transactions in the dataset)
    const customer: ICustomer = {
      name: data[0]?.customerName || "",
      email: data[0]?.email || "",
      number: data[0]?.number || "",
    };
  
    // Construct the transaction object
    const transaction: ITransaction = {
      customer,
      boughtOn: new Date(data[0]?.boughtOn ?? today),
      totalPrice: total,
      orders,
    };
  
    return transaction;
  };

  const bulkUploadOrders = async (data: ITransactionCSV[]) => {
    const parsedData : ITransaction = parseData(data);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Bulk Upload successfully:", result);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  
  return (
    <>
      <div className="bg-gray-100 h-screen py-8 text-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
          <div className="flex items-center gap-2">
            <div className="w-3/4">
              <SearchProduct onAddProduct={handleAddProduct} />
            </div>
            <div className="w-1/8">
              <button
                className="btn bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
                onClick={() => {
                  setShowBulkUploadModall(true);
                }}
              >
                Bulk Upload
              </button>
            </div>
          </div>

          {showBulkUploadModal && (
            <Modal
              show={showBulkUploadModal}
              onClose={() => setShowBulkUploadModall(false)}
            >
              <Uploader<ITransactionCSV>
                text="Upload Order Data"
                handleUpload={bulkUploadOrders}
              />
            </Modal>
          )}
          <div className="flex gap-4 mt-4">
            <div className="w-1/4">
              <Reccomendations
                OnSelectReccomendedProduct={handleAddProduct}
                CartProducts={orders}
              />
            </div>
            <div className="w-2/4">
              {orders && (
                <CartProductList
                  orders={orders}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              )}
            </div>
            <div className="w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Taxes</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
                  onClick={() => {
                    if (orders.length > 0) {
                      setShowAddModal(true);
                    }
                  }}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Enter Customer Data
          </h3>
          <div>
            <label className="block text-gray-700">Customer Name</label>
            <input
              type="text"
              name="name"
              value={customer.name || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={customer.email || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={customer.number || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-700"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={checkOut}
            >
              CheckOut
            </button>
          </div>
        </Modal>
      )}

      {showReceiptModal && transaction && (
        <Modal show={showReceiptModal} onClose={() => setShowReceiptModall(false)}>
            <Receipt transaction={transaction} taxRates={{Taxes:0.1,Shipping:0}}></Receipt>
        </Modal>
      )}
    </>
  );
};

export default Cart;
