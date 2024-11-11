"use client"
import React, { useState, useEffect } from "react";
import { IProduct } from "@/type/product/product";

interface SearchBarProps {
  onAddProduct: (product: IProduct) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        const response = await fetch(`api/product/search?searchterm=${searchTerm}`);
        // const data: Array<IProduct> = await response.json();
        const data: IProduct[] = [
          {
            id: "567",
            name: "Bag",
            price: 100,
            stock: 8,
          },
          {
            id: "569",
            name: "Bottle",
            price: 50,
            stock: 90,
          },
        ];
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
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="border rounded-lg p-2 w-full"
        placeholder="Search for products..."
      />
      {results.length > 0 && (
        <div className="bg-white border rounded-lg shadow-md w-full mt-2 z-10">
          {results.map((product) => (
            <div
              key={product.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectProduct(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-8 w-8 mr-2 inline-block"
              />
              <span>
              {product.name} - ${product.price.toFixed(2)} - Stock: {product.stock}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
