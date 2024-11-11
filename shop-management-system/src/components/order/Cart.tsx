"use client";
import React, { useState } from "react";
import CartProductList from "./CartProductList";
import SearchProduct from "./SearchProduct";
import { IOrder, IProduct } from "@/type";
import Reccomendations from "./Reccomendation";
import { productList } from "@/agent/product/product";
import { ICustomer } from "@/type/user/user";
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
  const [orders, setOrders] = useState<Array<IOrder>>(demoOrders);

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

  const checkOut = async (orders: IOrder[], customer: ICustomer) => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders, customer }),
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

  return (
    <div className="bg-gray-100 h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <SearchProduct onAddProduct={handleAddProduct} />
        <div className="flex flex-col gap-4 mt-4">
          <div className="md:w-full">
            <Reccomendations
              OnSelectReccomendedProduct={handleAddProduct}
              CartProducts={orders}
            />
          </div>
          <div className="flex flex-row gap-4 mt-4">
            <div className="w-1/6"></div>
            <div className="w-2/3">
              <CartProductList
                orders={orders}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            </div>
            <div className="w-1/6">
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
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full">
                  Checkout
                </button>
              </div>
            </div>
            <div className="w-1/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
