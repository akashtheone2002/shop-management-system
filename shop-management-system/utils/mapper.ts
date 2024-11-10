import { IProduct } from "@/type/product/product";
import { Product } from "@prisma/client";

export function mapProducts(prisma: Product, product: IProduct){
    return {
        id: prisma.id,
        name: prisma.name,
        image: prisma.image ?? "", 
        price: prisma.price.toString(), 
        stock: prisma.stock ?? 0, 
        description: prisma.description ?? "", 
        category: prisma.category ?? "", 
        createdAt: prisma.createdAt ?? "", 
    }
}
  