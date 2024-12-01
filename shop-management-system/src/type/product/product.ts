export interface IProduct {
    id: string;
    name: string;
    image?: string;
    price: number;
    stock: number;
    description?: string;
    category?: string;
    createdAt?: string;
}

export interface IProductCsv {
    name: string;
    image?: string;
    price: number;
    stock: number;
    description?: string;
    category?: string;
    [key: string]: unknown;
}