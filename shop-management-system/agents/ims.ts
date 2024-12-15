import { bulkInsertEntity, deleteEntity, getEntities, getEntitiesByCondition, insertEntity, updateEntity } from "../services/services";
import { mapEntityListToProductList, mapEntityToProduct, mapProductListToEntityList, mapProductToEntity } from "../utils/mapper";

export const updateProduct = async (product: IProduct) : Promise<IProduct[]> => {
    const entity = mapProductToEntity(product);
    const updatedProduct = await updateEntity(entity.id, entity)
    if (!updatedProduct) {
        throw new Error("Product not found");
    }
    const availableProducts = await getEntities(EntityType.PRODUCT);
    const results = mapEntityListToProductList(availableProducts);
    return results;
}

export const deleteProduct = async (id: string) : Promise<IProduct[]> => {
    const updatedProduct = await deleteEntity(id)
    if (!updatedProduct) {
        throw new Error("Product not found");
    }
    const availableProducts = await getEntities(EntityType.PRODUCT);
    const results = mapEntityListToProductList(availableProducts);
    return results;
}

export const addProduct = async (product: IProduct) : Promise<IProduct[]>=> {
    const entity = mapProductToEntity(product);
    const updatedProduct = await insertEntity(entity)
    if (!updatedProduct) {
        throw new Error("Product not found");
    }
    const availableProducts = await getEntities(EntityType.PRODUCT);
    const results = mapEntityListToProductList(availableProducts);
    return results;
}

export const productList = async (search?: string,
    sort?: string,
    order?: "asc" | "desc",
    page?: number,
    pageSize?: number) => {
    const availableProducts = await getEntities(EntityType.PRODUCT,search,sort,order,page,pageSize);
    if (!availableProducts || availableProducts.length == 0) {
        throw new Error("Product not found");
    }

    const results = mapEntityListToProductList(availableProducts);
    return results;
}

export const searchProduct = async (searchTerm: string) : Promise<Array<IProduct>>=> {
    const availableProducts = await getEntities(EntityType.PRODUCT, searchTerm);
    if (!availableProducts || availableProducts.length == 0) {
        throw new Error("Product not found");
    }

    const results = mapEntityListToProductList(availableProducts);
    return results;
}

export const bulkUploadProducts = async (products: IProduct[]) : Promise<Array<IProduct>>=> {
    const entities = mapProductListToEntityList(products);
    const output = await bulkInsertEntity(entities);
    if (output){
        throw new Error("Error occured.");
    }
    const availableProducts = await getEntities(EntityType.PRODUCT);
    const results = mapEntityListToProductList(availableProducts);
    return results;
}

export async function updateProductsByOrders(orders: IOrder[]) {
    // Get product IDs from the orders
    const productIds = orders.map(order => order.product?.id).filter((id): id is string => id !== undefined);
  
    if (productIds.length === 0) {
      throw new Error("No products to update.");
    }
  
    // Fetch available products based on product IDs
    const availableProducts = await getEntitiesByCondition({
      AND: [
        { entityType: EntityType.PRODUCT },
        { id: { in: productIds } },
      ],
    });
  
    // Update the quantities of the available products
    for (const product of availableProducts) {
      const correspondingOrder = orders.find(order => order.product?.id === product.id);
  
      if (!correspondingOrder || !correspondingOrder.quantity) {
        continue; // Skip if there's no matching order or quantity
      }
  
      // Calculate new quantity
      const updatedQuantity = (product.quantity || 0) - correspondingOrder.quantity;
  
      // Ensure quantity is not negative
      const quantityToUpdate = Math.max(updatedQuantity, 0);
  
      // Update the product entity
      await updateEntity(product.id, {
        ...product, 
        quantity: quantityToUpdate,
      });
    }
  }

export async function getProductsByProductIds(productIds: string[]): Promise<IProduct[]> {
  const availableProducts = await getEntitiesByCondition({
    AND: [
      { entityType: EntityType.PRODUCT },
      { id: { in: productIds } },
    ],
  });
  return availableProducts.map((product) => mapEntityToProduct(product));
}

export async function downloadProducts(){
    const products: IProduct[] = await productList("", "modifiedOn", "desc", 1, 10000);
    const csvData = convertToCSV(products);
    const name = "Inventory_" + String(new Date()) + ".csv";
    downloadCSVFile(csvData, name);
}