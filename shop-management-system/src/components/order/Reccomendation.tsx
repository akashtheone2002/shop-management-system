"use client";
import { IOrder, IProduct } from "@/types/apiModels/apiModels";
import React, { useEffect, useState } from "react";

interface ReccomendationsProp {
  OnSelectReccomendedProduct: (product: IProduct) => void;
  CartProducts: IOrder[];
}

const Reccomendations: React.FC<ReccomendationsProp> = ({
  OnSelectReccomendedProduct,
  CartProducts,
}) => {
  const [reccomendedProducts, setReccomendedProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async (products: IOrder[]) => {
      if (CartProducts.length <= 0) return;

      try {
        const response = await fetch("/api/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(products),
        });
        const result = await response.json();
        setReccomendedProducts(result);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    fetchProducts(CartProducts);
  }, [CartProducts]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">✨ Recommended Products</h2>

      {reccomendedProducts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-[500px] overflow-y-auto">
          {/* List Format */}
          <ul className="divide-y divide-gray-200">
            {reccomendedProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                onClick={() => OnSelectReccomendedProduct(product)}
              >
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-md"
                />

                {/* Product Info */}
                <div className="flex-1">
                  <p className="text-gray-800 font-medium truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    ${product?.price?.toFixed(2)} | Stock: {product.stock}
                  </p>
                </div>

                {/* Select Button */}
                <button className="text-blue-600 font-semibold hover:underline">
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reccomendations;

