import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createProduct(name: string, stock: number, price: number, description: string, image: string, category: string) {
    try {
        const product = await prisma.product.create({
            data: {
                name,
                stock,
                price,
                description,
                image,
                category,
                createdAt: String(Date.now())
            }
        },
        )
        return product;
    }
    catch (error) {
        console.log("error hai idhar", error)
    }
}

export async function getProducts() {
    const product = await prisma.product.findMany();
    return product;
}