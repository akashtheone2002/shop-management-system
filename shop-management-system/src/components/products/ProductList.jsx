"use client"
import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';

export const ProductList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch data from the API during build time
    async function getStaticProps() {
        const res = await fetch('api/feed-sample');
        const products = await res.json();
        setProducts(products);
    }

    useEffect(() => {
        getStaticProps();
    }, []);

    return (
        <div className="container mx-auto py-8 px-8 bg-white">
            <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 mb-6 border rounded text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

