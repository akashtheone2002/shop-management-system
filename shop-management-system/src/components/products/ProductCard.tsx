"use client"

import React, { useState } from 'react';
import Modal from '../common/Modal';

interface ProductCardProps {
    product: IProduct;
    onEdit: (product: IProduct) => void;
    onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editedProduct, setEditedProduct] = useState<IProduct>(product);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete(product.id || "");
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEdit(editedProduct);
        setShowEditModal(false);
    };

    const handleCancelEdit = () => {
        setShowEditModal(false);
        setEditedProduct(product);
    };

    return (
        <>
            <div className="border p-6 rounded-xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl bg-white overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover rounded-lg mb-4"
                />

                <div className="flex-grow">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-lg text-gray-500 mb-2">{product.category}</p>
                    <p className="font-semibold text-xl text-gray-700">${product.price}</p>
                </div>

                <div className="flex justify-between mt-4 space-x-4">
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                        onClick={handleEditClick}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal show={showDeleteModal} onClose={() => { setShowDeleteModal(false) }}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                    <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                            onClick={handleCancelDelete}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <Modal show={showEditModal} onClose={() => { setShowEditModal(false) }}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Product</h3>
                    <form onSubmit={handleEditSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={editedProduct.name}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={editedProduct.category}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Price</label>
                            <input
                                type="text"
                                name="price"
                                value={editedProduct.price}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={editedProduct.image}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={editedProduct.stock}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
};
