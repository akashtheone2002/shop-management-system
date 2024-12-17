import { getSession, getSessionUserId } from "@/app/lib/session";
import {
  bulkInsertEntity,
  deleteEntity,
  getEntities,
  getEntitiesByCondition,
  getEntity,
  getEntityByCondition,
  getPaginationMetaData,
  insertEntity,
} from "../services/services";
import {
  mapCustomerToEntity,
  mapEntityToCustomer,
  mapEntityToOrder,
  mapEntityToProduct,
  mapOrderToEntity,
  mapTransactionPayload,
  mapTransactionToFlat,
} from "../utils/mapper";
import { updateProductsByOrders } from "./ims";
import { ICustomer, IFlatTransaction, IOrder, ITransaction, ITransactionList, ITransactionPayload } from "@/types/apiModels/apiModels";
import { EntityType, IEntity } from "@/types/entity/entity";

async function addCustomer(customer: ICustomer) {
  const customerEntity = await getEntityByCondition({
    OR: [
      { email: customer.email },
      { name: customer.name },
      { number: customer.number },
    ],
  });

  if (customerEntity) {
    return customerEntity;
  }

  const entity: IEntity = mapCustomerToEntity(customer);

  return await insertEntity(entity);
}

async function addOrders(orders: IOrder[]) {
  const orderEntities = orders.map((order) => mapOrderToEntity(order));
  const insertResult = await bulkInsertEntity(orderEntities);
  if (!insertResult) {
    throw new Error("Failed to create order.");
  }

  await updateProductsByOrders(orders);

  const insertedOrder = await getEntitiesByCondition({
    entityType: EntityType.ORDER,
    id: { in: orderEntities.map((order) => order.id) },
  });
  return insertedOrder.map((order) => mapEntityToOrder(order));
}

function getTransactionPayload(customerId: string, orderIds: string[]): string {
  const payload: ITransactionPayload = {
    customer: customerId,
    orders: orderIds,
  };
  return JSON.stringify(payload);
}

export default async function placeTransaction(
  orders: IOrder[],
  customer: ICustomer
) {
  const userId = await getSessionUserId();

  const customerEntity = await addCustomer(customer);
  const orderEntities = await addOrders(orders);

  // Calculate total price
  const totalPrice = orders.reduce(
    (total, order) => total + (order.price || 1),
    0
  );

  const transactionEntity: IEntity = {
    id: "",
    entityType: EntityType.TRANSACTION,
    price: totalPrice,
    jsonPayload: getTransactionPayload(
      customerEntity.id,
      orderEntities.map((order) => order.id || "")
    ),
    modifiedOn: new Date(),
    modifiedBy: userId,
  };

  const result = await insertEntity(transactionEntity);
  const transaction = fetchTransactionById(result.id);
  return transaction;
}

export async function fetchTransactionHistory(
    search?: string,
    sort?: string,
    order?: "asc" | "desc",
    page?: number,
    pageSize?: number
) : Promise<ITransactionList> {
  try {
    const transactionsEntities =  await getEntities(EntityType.TRANSACTION, search, sort, order, page, pageSize);
    const transactions : ITransaction[] = await Promise.all(transactionsEntities.map(async (transaction) => await fetchTransactionById(transaction.id)));
    const metaData = await getPaginationMetaData(EntityType.TRANSACTION, search, page, pageSize);
    return {
        transactions: transactions,
        metadata: metaData,
    };
  } catch (error) {
    console.error("Error in Agent fetching transaction history:", error);
    throw new Error("Failed to fetch transaction history.");
  }
}

export async function fetchTransactionById(id: string): Promise<ITransaction> {
  const transaction: IEntity = await getEntity(id);
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  const payload = transaction.jsonPayload;
  const mappedTransactionPayload = mapTransactionPayload(payload || "");
  const orders: IOrder[] = await getOrdersFromPayload(mappedTransactionPayload.orders ?? []);
  const customerEntity = await getEntity(mappedTransactionPayload.customer || "");
  const customer: ICustomer = mapEntityToCustomer(customerEntity);

  return {
    id: id,
    customer: customer,
    orders: orders,
    totalPrice: transaction.price,
    boughtOn: transaction.modifiedOn,
  };
}

export async function returnOrder(orderId: string) {
  const deleteResult = await deleteEntity(orderId);
  if (!deleteResult) {
    throw new Error("Order not found");
  }
  return true;
}

async function getOrdersFromPayload(orders: string[]){
    let result = [];
    for (const orderId of orders) {
      const entity: IEntity = await getEntity(orderId);
      if (!entity) {
        const order: IOrder = {
          id: "deletedEntity",
          quantity: 0,
          product: {
            id: "deletedEntity",
            name: "Deleted Product",
          },
        };
        result.push(order);
        continue;
      }
      const order: IOrder = mapEntityToOrder(entity);
      const product: IEntity = await getEntity(order.product?.id || "");
      if (!product) {
      }
      order.product = mapEntityToProduct(product);
      result.push(order);
    }
    return result;
}
  
export async function downloadTransactions(){
    const transactions : ITransactionList = await fetchTransactionHistory("", "modifiedBy","desc", 1, 10000);
    const flatTransactions : IFlatTransaction[] = transactions.transactions.map((transaction) => mapTransactionToFlat(transaction));
    const csvData = convertToCSV(flatTransactions);
    const name = "Transaction_" + String(new Date()) + ".csv";
    downloadCSVFile(csvData, "transactions.csv");
}
