"use client"

import React, { useState } from 'react';
import { IProduct } from '@/type/product/product';

interface ProductCardProps {
    product: IProduct;
    onEdit: (product: IProduct) => void;
    onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
    const [showEditModal, setShowEditModal] = useState(false); // Manage edit modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Manage delete confirmation modal visibility
    const [editedProduct, setEditedProduct] = useState<IProduct>(product); // State for the editable product fields

    // Handle delete modal
    const handleDeleteClick = () => {
        setShowDeleteModal(true); // Open the delete confirmation modal
    };

    const handleConfirmDelete = () => {
        onDelete(product.id); // Call the delete function with product ID
        setShowDeleteModal(false); // Close the delete modal
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false); // Close the modal without deleting
    };

    // Handle edit modal
    const handleEditClick = () => {
        setShowEditModal(true); // Open the edit modal
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value }); // Update form fields
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEdit(editedProduct); // Call the edit function with updated product
        setShowEditModal(false); // Close the edit modal
    };

    const handleCancelEdit = () => {
        setShowEditModal(false); // Close the modal without saving changes
        setEditedProduct(product); // Reset to the original product details
    };

    return (
        <>
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
                        onClick={handleEditClick}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition duration-200"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Product</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editedProduct.name}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={editedProduct.category}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={editedProduct.price}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    name="image"  // Change from "Image URL" to "image"
                                    value={editedProduct.image}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={editedProduct.stock}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
