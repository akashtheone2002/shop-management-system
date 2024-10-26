import React from 'react';

export const ProductCard = ({ product, onEdit, onDelete }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full">
            <img src={product.image} alt={product.name} className="h-48 w-full object-contain mb-4" />

            {/* Title, Category, Price */}
            <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-black">{product.name}</h2>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <p className="font-bold text-lg mb-2 text-gray-600">${product.price}</p>
            </div>

            {/* Edit and Delete Buttons */}
            <div className="flex justify-between mt-auto space-x-2">
                <button
                    className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-200"
                    onClick={() => onEdit(product)}
                >
                    Edit
                </button>
                <button
                    className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition duration-200"
                    onClick={() => onDelete(product.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};
