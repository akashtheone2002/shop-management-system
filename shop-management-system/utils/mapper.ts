export function mapEntityToUser(entity: IEntity): IUser{
    return {
        id : entity.id,
        name: entity.name,
        email: entity.email,
        password: entity.password,
        role: entity.role
    }
}

export function mapEntityListToProductList(entityList: IEntity[]): IProduct[]{
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

export function mapProductToEntity(product: IProduct): IEntity{
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
}

export function mapProductListToEntityList(productList: IProduct[]): IEntity[]{
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

export function mapEntityToOrder(entity: IEntity): IOrder{
    return {
        id: entity.id,
        quantity: entity.quantity,
        price: entity.price,
        product: {
            id: entity.jsonPayload
        }
    }
}

export function mapEntityToProduct(entity: IEntity): IProduct{
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

export function mapCustomerToEntity(customer: ICustomer): IEntity{
    return {
        id: customer.id || "",
        entityType: EntityType.CUSTOMER,
        name: customer.name,
        email: customer.email,
        number: customer.number
    }
}

export function mapOrderToEntity(order: IOrder): IEntity{
    return {
        id: order.id || "",
        entityType: EntityType.ORDER,
        quantity: order.quantity,
        price: order.price,
        jsonPayload: order.product?.id
    }
}

export function mapEntityToCustomer(entity: IEntity): ICustomer{
    return {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        number: entity.number
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
  