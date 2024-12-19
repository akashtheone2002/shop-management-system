import { getSession, getSessionUserId } from "@/app/lib/session";
import { v4 as uuid } from 'uuid';
import {
  mapCustomerToEntity,
  mapEntityToCustomer,
  mapEntityToOrder,
  mapEntityToProduct,
  mapEntityToTransaction,
  mapOrderToEntity,
  mapTransactionPayload,
  mapTransactionToFlat,
} from "../utils/mapper";
import { ICustomer, IFlatTransaction, IOrder, ITransaction, ITransactionList, ITransactionPayload } from "@/types/apiModels/apiModels";
import { EntityType, IEntity } from "@/types/entity/entity";
import { BulkInsertEntity, DeleteEntity, GetEntities, GetEntitiesByCondition, GetEntity, GetEntityByCondition, GetPaginationMetaData, InsertEntity } from "../services/services";
import { updateProductsByOrders } from "./ims";

async function addCustomer(customer: ICustomer) {
  if(customer?.id){
    const customerEntity = await GetEntityByCondition(` id = '${customer.id}'`);
  
    if (customerEntity) {
      return customerEntity;
    }
  }
  const entity = mapCustomerToEntity(customer);

  const result = await InsertEntity(entity);
  return mapEntityToCustomer(result);
}

async function addOrders(orders: IOrder[]) {
  const orderEntities = orders.map((order) => mapOrderToEntity(order));
  const insertResult = await BulkInsertEntity(orderEntities);
  if (!insertResult) {
    throw new Error("Failed to create order.");
  }

  await updateProductsByOrders(orders);
  const whereCondtion = ` id in ('${orderEntities.map((order) => order.id).join(`','`)}')`;
  const insertedOrder = await GetEntitiesByCondition(whereCondtion);
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
  customer: ICustomer,
  total : number
) {
  const userId = await getSessionUserId();

  const customerDetails = await addCustomer(customer);
  const orderList = await addOrders(orders);

  const transactionEntity: IEntity = {
    id: uuid(),
    entityType: EntityType.TRANSACTION,
    price: total,
    jsonPayload: getTransactionPayload(
      customerDetails.id || "",
      orderList.map((order) => order.id || "")
    ),
    modifiedOn: new Date(),
    modifiedBy: userId,
  };

  const result = await InsertEntity(transactionEntity);
  const transaction = mapEntityToTransaction(result);
  transaction.orders = orderList;
  transaction.orders.forEach(order => { order.product = orders.find(o => o?.product?.id === order?.product?.id)?.product});
  transaction.customer = customerDetails;
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
    const transactionsEntities =  await GetEntities(EntityType.TRANSACTION, search, sort, order, page, pageSize);
    const transactions = await Promise.all(transactionsEntities.map(async (transaction) => await fetchTransactionById(transaction.id)));
    const metaData = await GetPaginationMetaData(EntityType.TRANSACTION, search, page, pageSize);
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
  const transaction: IEntity = await GetEntity(id);
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  const payload = transaction.jsonPayload;
  const mappedTransactionPayload = mapTransactionPayload(payload || "");
  const orders: IOrder[] = await getOrdersFromPayload(mappedTransactionPayload.orders ?? []);
  const customerEntity = await GetEntity(mappedTransactionPayload.customer || "");
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
  const deleteResult = await DeleteEntity(orderId);
  if (!deleteResult) {
    throw new Error("Order not found");
  }
  return true;
}

async function getOrdersFromPayload(orders: string[]){
    let result = [];
    for (const orderId of orders) {
      const entity: IEntity = await GetEntity(orderId);
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
      const product: IEntity = await GetEntity(order.product?.id || "");
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
