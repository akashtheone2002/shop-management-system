"use client";
import { IProduct } from "@/types/apiModels/apiModels";
import React, { useState, useEffect } from "react";

interface SearchBarProps {
  onAddProduct: (product: IProduct) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        const url = new URL("/api/product", window.location.origin);
        const params = new URLSearchParams({
          search: searchTerm,
          sort: "modifiedOn",
          order: "desc",
          page: "1",
          pageSize: "10",
        });

        url.search = params.toString();
        const response = await fetch(url.toString());
        const data: Array<IProduct> = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectProduct = (product: IProduct) => {
    onAddProduct(product);
    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="border border-gray-300 rounded-lg p-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        placeholder="🔍 Search for products..."
      />

      {/* Grid View for Search Results */}
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 max-h-[500px] overflow-y-auto transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product) => (
              <div
                key={product.id}
                className="bg-gray-100 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => handleSelectProduct(product)}
              >
                {/* Product Image */}
                <div className="relative w-full h-32">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Product Info */}
                <div className="mt-2 text-center">
                  <p className="text-gray-800 font-semibold truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    ${product?.price?.toFixed(2)} | Stock: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchBar;
