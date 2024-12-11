"use client";
import React, { useState } from "react";
import CartProductList from "./CartProductList";
import SearchProduct from "./SearchProduct";
import {
  ICustomer,
  IOrder,
  IProduct,
  ITransaction,
  ITransactionCSV,
} from "@/type";
import {
  ICustomer,
  IOrder,
  IProduct,
  ITransaction,
  ITransactionCSV,
} from "@/type";
import Reccomendations from "./Reccomendation";
import Modal from "../common/Modal";
import Uploader from "../common/Uploader";
import Modal from "../common/Modal";
import Uploader from "../common/Uploader";
const demoOrders: IOrder[] = [
  {
    productId: "2",
    name: "Product name",
    price: 19.99,
    quantity: 1,
    image: "https://via.placeholder.com/150",
  },
];
const Cart = () => {
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showBulkUploadModal, setShowBulkUploadModall] =
    useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState<ICustomer>({
    name: "",
    email: "",
    phone: "",
  });
  const [csv, setCsv] = useState<File | null>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    // Reset the form if cancel is clicked
    setShowAddModal(false);

    setNewCustomer({
      name: "",
      email: "",
      phone: "",
    });
  };
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showBulkUploadModal, setShowBulkUploadModall] =
    useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState<ICustomer>({
    name: "",
    email: "",
    phone: "",
  });
  const [csv, setCsv] = useState<File | null>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    // Reset the form if cancel is clicked
    setShowAddModal(false);

    setNewCustomer({
      name: "",
      email: "",
      phone: "",
    });
  };

  const handleIncrease = (index: number) => {
    const newProducts = [...orders];
    newProducts[index].quantity += 1;
    setOrders(newProducts);
  };

  const handleDecrease = (index: number) => {
    const newProducts = [...orders];
    if (newProducts[index].quantity > 1) {
      newProducts[index].quantity -= 1;
      setOrders(newProducts);
    }
  };

  const handleRemove = (index: number) => {
    const newProducts = orders.filter((_, i) => i !== index);
    setOrders(newProducts);
  };

  const handleAddProduct = (product: IProduct) => {
    const existingProductIndex = orders.findIndex(
      (p) => p.productId === product.id
    );
    if (existingProductIndex > -1) {
      const newProducts = [...orders];
      newProducts[existingProductIndex].quantity += 1;
      setOrders(newProducts);
    } else {
      setOrders([
        ...orders,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image || "",
        },
      ]);
    }
  };

  const checkOut = async () => {
    console.log(orders);
    console.log(newCustomer);
  const checkOut = async () => {
    console.log(orders);
    console.log(newCustomer);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders, newCustomer }),
        body: JSON.stringify({ orders, newCustomer }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Order placed successfully:", result);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const subtotal = orders.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const taxes = subtotal * 0.1; // Assuming 10% tax rate
  const total = subtotal + taxes;

  const parseData = (data: ITransactionCSV[]): ITransaction[] => {
    const today = new Date();

    return data.map((item, index) => {
      // Calculate totalPrice from the sum of price * quantity
      const totalPrice = item.price && item.quantity ? item.price * item.quantity : 0;

      // Construct orders array
      const orders: IOrder[] = [
        {
          productId: item.productId || "",
          name: item.productName || "",
          quantity: item.quantity || 0,
          price: item.price || 0,
          image: "", // Placeholder for image field
        },
      ];

      // Construct customer data
      const customer: ICustomer = {
        name: item.customerName || "",
        email: item.customerEmail || "",
        phone: item.customerPhone || "",
      };

      // Construct the transaction
      const transaction: ITransaction = {
        customer,
        boughtOn: new Date(item.boughtOn ?? today),
        totalPrice: totalPrice,
        orders,
        modifiedBy: "", // Assuming no information provided for this
        modifiedOn: today, // Set to today's date
      };

      return transaction;
    });
  };

  const bulkUploadOrders = async (data: ITransactionCSV[]) => {
    const parsedData = parseData(data);

    try {
      const response = await fetch("/api/order/bulk", {
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
              <div className="max-h-screen overflow-y-auto">
              <Uploader<ITransactionCSV>
                text="Upload Order Data"
                handleUpload={bulkUploadOrders}
              />
              </div>
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
              value={newCustomer.name || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={newCustomer.email || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={newCustomer.phone || ""}
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
    </>
  );
};

export default Cart;
