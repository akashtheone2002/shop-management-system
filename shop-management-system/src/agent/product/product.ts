import { IProduct } from "@/type/product/product"
import { updateProduct, deleteProduct, getProducts, createProduct, getProductsBySearchTerm } from "../../../prisma/product"

export const updatedProduct = async (product: IProduct) => {
    debugger;
    const updatedProduct = await updateProduct(product)
    if (!updatedProduct) {
        return { message: "Product not found" };
    }
    const availableProducts = getProducts();
    return availableProducts;
}

export const deletedProduct = async (id: string) => {
    const updatedProduct = await deleteProduct(id)
    if (!updatedProduct) {
        return { message: "Product not found" };
    }
    const availableProducts = getProducts();
    return availableProducts;
}

export const addingProduct = async (product: IProduct) => {
    const updatedProduct = await createProduct(product)
    if (!updatedProduct) {
        return { message: "Product not found" };
    }
    const availableProducts = getProducts();
    return availableProducts;
}

export const productList = async () => {
    const availableProducts = await getProducts();
    if (!updatedProduct) {
        return { message: "Product not found" };
    }
    return availableProducts;
}

export const searchProduct = async (searchTerm: string) : Promise<Array<IProduct>>=> {
    return  await getProductsBySearchTerm(searchTerm);
}
