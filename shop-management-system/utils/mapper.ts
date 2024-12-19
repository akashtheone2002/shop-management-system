import { ICustomer, IFlatTransaction, IOrder, IProduct, ITransaction, ITransactionPayload, IUser } from "@/types/apiModels/apiModels";
import { EntityInsert, EntityType, EntityInsert } from "@/types/entity/entity";
import { v4 as uuid } from 'uuid';

export function mapEntityToUser(entity: EntityInsert): IUser{
    return {
        id : entity.id,
        name: entity.name || "",
        email: entity.email || "",
        password: entity.password || "",
        role: entity.role || "",
    }
}

export function mapEntityListToProductList(entityList: EntityInsert[]): IProduct[]{
    return entityList.map((entity) => {
        return {
            id: entity.id,
            name: entity.name,
            image: entity.image,
            price: entity.price,
            stock: entity.quantity,
            description: entity.description,
            category: entity.category
        }   
    });
}

export function mapProductToEntity(product: IProduct): EntityInsert{
    return {
        id: product.id || uuid(),
        entityType: EntityType.PRODUCT,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: product.stock,
        description: product.description,
        category: product.category,
        modifiedOn: new Date(),
    }
}

export function mapProductListToEntityList(productList: IProduct[]): EntityInsert[]{
    return productList.map((product) => {
        return {
            id: product.id || "",
            entityType: EntityType.PRODUCT,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: product.stock,
            description: product.description,
            category: product.category,
            modifiedOn: new Date(),
        }
    });
}

export function mapTransactionPayload(data:string): ITransactionPayload{
    if(!data){
        throw new Error("No transaction payload.");
    }
    return JSON.parse(data) as ITransactionPayload;
}

export function mapEntityToOrder(entity: EntityInsert): IOrder{
    return {
        id: entity.id,
        quantity: entity.quantity || 0,
        price: Number(entity.price) || 0,
        product: {
            id: entity.jsonPayload || ""
        }
    }
}

export function mapEntityToProduct(entity: EntityInsert): IProduct{
    return {
        id: entity.id,
        name: entity.name,
        image: entity.image,
        price: entity.price,
        stock: entity.quantity,
        description: entity.description,
        category: entity.category
    }
}

export function mapCustomerToEntity(customer: ICustomer): EntityInsert{
    return {
        id: customer.id || uuid(),
        entityType: EntityType.CUSTOMER,
        name: customer.name,
        email: customer.email,
        number: customer.number
    }
}

export function mapOrderToEntity(order: IOrder): EntityInsert{
    return {
        id: order.id || uuid(),
        entityType: EntityType.ORDER,
        quantity: order.quantity,
        price: order.price,
        jsonPayload: order.product?.id
    }
}

export function mapEntityToCustomer(entity: EntityInsert): ICustomer{
    return {
        id: entity.id,
        name: entity.name || "",
        email: entity.email || "",
        number: entity.number || "",
    }
}

export function mapTransactionToFlat(transaction: ITransaction): IFlatTransaction {
    const firstOrder = transaction.orders?.[0]; // Assuming a single order for flattening simplicity
    const product = firstOrder?.product;
  
    return {
      id: transaction.id,
      boughtOn: transaction.boughtOn,
      totalPrice: transaction.totalPrice,
  
      // Customer fields
      customerName: transaction.customer?.name,
      customerEmail: transaction.customer?.email,
      customerNumber: transaction.customer?.number,
  
      // User fields
      userName: transaction.user?.name,
  
      // Order fields
      orderQuantity: firstOrder?.quantity,
      orderPrice: firstOrder?.price,
      productName: product?.name,
      productPrice: product?.price,
    };
  }
  
  export function mapEntityToTransaction(transaction: EntityInsert): ITransaction{
    return {
        id: transaction.id,
        boughtOn: transaction.modifiedOn,
        totalPrice: transaction.price,
    }
  }