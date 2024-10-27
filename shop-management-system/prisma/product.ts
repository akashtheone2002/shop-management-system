import { IProduct } from '@/type/product/product';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createProduct(product: IProduct) {
    try {
        const products = await prisma.product.create({
            data: {
                name: product.name,
                stock: product.stock,
                price: parseFloat(product.price),
                description: product.description,
                image: product.image,
                category: product.category,
                createdAt: String(Date.now())
            }
        },
        )
        return products;
    }
    catch (error) {
        console.log("error hai idhar", error)
    }
}

export async function getProducts(): Promise<IProduct[]> {
    const products = await prisma.product.findMany();
    const productList = products.map((p) => ({
        ...p,
        price: p.price.toString(), // Convert price to string
    }));
    return productList;
}

export async function deleteProduct(id: string) {
    const product = await prisma.product.delete({
        where: {
            id: id
        }
    });
    return product;
}

export async function updateProduct(product: IProduct) {
    console.log("Updating product:", product); // Log the product being updated
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: product.id },
            data: {
                name: product.name,
                stock: product.stock,
                price: parseFloat(product.price), // Ensure price is a float
                description: product.description,
                image: product.image,
                category: product.category,
            },
        });
        console.log("Successfully updated product:", updatedProduct); // Log successful updates
        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error); // Log the specific error
        throw new Error("Failed to update product"); // Rethrow or handle as needed
    }
}

