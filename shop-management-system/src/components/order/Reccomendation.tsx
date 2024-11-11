import { IOrder, IProduct } from "@/type";
import React, { useEffect, useState } from "react";

interface ReccomendationsProp {
  OnSelectReccomendedProduct: (product: IProduct) => void;
  CartProducts: IOrder[];
}

const Reccomendations: React.FC<ReccomendationsProp> = async ({ OnSelectReccomendedProduct, CartProducts,}) => {
  const [reccomendedProducts, setReccomendedProducts] = useState<IProduct[]>([]);
  
  useEffect(() => {
    const fetchProducts = async (products: IOrder[]) => {
      try {
        const response = await fetch("api/reccomendation");
        const result = await response.json();
        setReccomendedProducts(result);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };
    fetchProducts(CartProducts);
  }, [CartProducts]);

  return (
    <>
      <div>Reccomendations</div>
      <div>
        {reccomendedProducts.length > 0 && (
          <div className="absolute bg-white border rounded-lg shadow-md w-full mt-2 z-10">
            {reccomendedProducts.map((product) => (
              <div
                key={product.id}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => OnSelectReccomendedProduct(product)}
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
    </>
  );
};

export default Reccomendations;
