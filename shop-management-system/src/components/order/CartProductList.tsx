"use client";
import React from 'react';
interface Product {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProductListProps {
  products: Product[];
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
  onRemove: (index: number) => void;
}

const CartProductList:React.FC<CartProductListProps> = ({ products, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left font-semibold">Product</th>
            <th className="text-left font-semibold">Price</th>
            <th className="text-left font-semibold">Quantity</th>
            <th className="text-left font-semibold">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products && products.map((product, index) => (
            <tr key={index}>
              <td className="py-4">
                <div className="flex items-center">
                  <img
                    className="h-16 w-16 mr-4"
                    src={product.image}
                    alt="Product image"
                  />
                  <span className="font-semibold">{product.name}</span>
                </div>
              </td>
              <td className="py-4">${product.price.toFixed(2)}</td>
              <td className="py-4">
                <div className="flex items-center">
                  <button
                    className="border rounded-md py-2 px-4 mr-2"
                    onClick={() => onDecrease(index)}
                  >
                    -
                  </button>
                  <span className="text-center w-8">{product.quantity}</span>
                  <button
                    className="border rounded-md py-2 px-4 ml-2"
                    onClick={() => onIncrease(index)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-4">
                ${(product.price * product.quantity).toFixed(2)}
              </td>
              <td className="py-4">
                <button
                  className="border rounded-md py-2 px-4"
                  onClick={() => onRemove(index)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartProductList;
