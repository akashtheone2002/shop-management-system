import { IProduct } from "@/type/product/product";
import React, { useState } from "react";

interface SearchBarProps {
  onAddProduct: (product: IProduct) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (event.target.value.length > 2) {
      const response= await fetch(
        `api/product/search?searchterm=${event.target.value}`
      );
      const data: Array<IProduct> = await response.json();
      setResults(data);
    } else {
      setResults([]);
    }
  };

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
        onChange={handleSearch}
        className="border rounded-lg p-2 w-full"
        placeholder="Search for products..."
      />
      {results.length > 0 && (
        <div className="absolute bg-white border rounded-lg shadow-md w-full mt-2 z-10">
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
                {product.name} - ${product.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
