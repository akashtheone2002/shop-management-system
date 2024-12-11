import { ITransaction } from "@/type";
import { PrismaClient } from "@prisma/client";
import { TransactionHistoryParams, TransactionHistoryResponse } from "@/type/transaction/transaction";
import { Parser } from 'json2csv';
import FPGrowth, { Itemset } from 'node-fpgrowth';

const prisma = new PrismaClient();

export async function addTransaction(transactionData: ITransaction) {
  try {
    // Find the customer
    let existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: transactionData.customer.email },
          { name: transactionData.customer.name },
          { number: transactionData.customer.phone },
        ],
      },
    });

    // If customer doesn't exist, create a new one
    if (!existingCustomer) {
      existingCustomer = await prisma.customer.create({
        data: {
          name: transactionData.customer.name||"",
          email: transactionData.customer.email,
          number: transactionData.customer.phone,
        },
      });
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        customerId: existingCustomer.id,
        boughtOn: transactionData.boughtOn || new Date(),
        totalPrice: transactionData.totalPrice || 0,
        createdBy: transactionData.modifiedBy || "",
        orders: {
          create: transactionData.orders.map((order) => ({
            productId: order.productId,
            quantity: order.quantity,
            price: order.price,
            image: order.image,
          })),
        },
      },
      include: {
        orders: true, // Include orders in the result
        customer: true, // Include customer in the result
      },
    });

    console.log("Transaction created:", transaction);
    return transaction;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTransactionHistory(params: TransactionHistoryParams = {}):Promise<TransactionHistoryResponse> {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "boughtOn",
    sortOrder = "desc",
  } = params;

  const skip = (page - 1) * limit; // Calculate items to skip

  try {
    // Fetch transactions with search, pagination, and sorting
    const transactions = await prisma.transaction.findMany({
      where: search
        ? {
            OR: [
              { customer: { name: { contains: search, mode: "insensitive" } } },
              { customer: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : undefined,
      select: {
        id: true, // Transaction ID
        boughtOn: true, // Bought date
        customer: {
          select: {
            name: true, // Customer name
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy === "customerName" ? "customer.name" : "boughtOn"]: sortOrder,
      },
    });

    // Count total matching records for pagination metadata
    const totalRecords = await prisma.transaction.count({
      where: search
        ? {
            OR: [
              { customer: { name: { contains: search, mode: "insensitive" } } },
              { customer: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : undefined,
    });

    // Return transactions with pagination metadata
    return {
        transactions: transactions.map((transaction) => ({
          transactionId: transaction.id,
          boughtBy: transaction.customer?.name || "Unknown",
          boughtOn: transaction.boughtOn,
        })),
        metadata: {
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
          totalRecords,
          limit,
        },
      };      
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Function to fetch a single transaction by transactionId
export async function getTransactionById(transactionId: string) {
  try {
    const transaction = await prisma.order.findMany({
      where: {
        transactionId: transactionId,
      },
      select: {
        productId: true,
        quantity: true,
        price: true,
        product: true,
      },
    });

    // Check if the transaction exists
    if (!transaction) {
      return { error: "Transaction not found" };
    }

    return transaction;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return { error: "An error occurred while fetching the transaction" };
  }
}


export async function returnOrderById(orderId: string) {
  try {
    // Find the order by its ID
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        transaction: {
          include: {
            orders: true, // Include all orders for this transaction to update the totalPrice
          },
        },
      },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    // Calculate the new total price by subtracting the returned order's price from the totalPrice
    const updatedOrders = order.transaction.orders.filter((o) => o.id !== orderId);
    const newTotalPrice = updatedOrders.reduce((total, currentOrder) => total + currentOrder.price, 0);

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Delete the order from the database
      await prisma.order.delete({
        where: { id: orderId },
      });

      // Update the transaction's totalPrice after removing the order
      await prisma.transaction.update({
        where: { id: order.transactionId },
        data: {
          totalPrice: newTotalPrice,
        },
      });
    });

    console.log('Order returned and transaction updated successfully');
    return result;
  } catch (error) {
    console.error('Error returning order:', error);
    throw new Error(`Failed to return order: ${orderId}`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function downloadTransactions(){
   // Fetch transactions with related data
   const transactions = await prisma.transaction.findMany({
    include: {
      customer: true,
      orders: {
        include: {
          product: true,
        },
      },
    },
  });

  // Flatten the transactions into a format suitable for CSV
  const flattenedData = transactions.flatMap((transaction) =>
    transaction.orders.map((order) => ({
      transactionId: transaction.id,
      boughtOn: transaction.boughtOn.toISOString(),
      totalPrice: transaction.totalPrice,
      customerName: transaction.customer.name,
      customerEmail: transaction.customer.email,
      customerNumber: transaction.customer.number,
      productId: order.productId,
      productName: order.product.name,
      productPrice: order.price,
      productQuantity: order.quantity,
      productImage: order.image,
    }))
  );

  
  // Convert to CSV
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(flattenedData);

  // Create a Blob from the CSV string and download it
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
}


async function fetchTransactions() {
  const transactions = await prisma.transaction.findMany({
    include: {
      orders: {
        include: {
          product: true,
        },
      },
    },
  });

  // Prepare data for FP-Growth
  const baskets = transactions.map((transaction) =>
    transaction.orders.map((order) => order.product.name)
  );

  return baskets;
}

async function runFPGrowth() {
  const baskets = await fetchTransactions();

  // FP-Growth algorithm options
  const fpgrowth = new FPGrowth.FPGrowth<number | string>(0.2);

  // Execute FPGrowth
  fpgrowth.exec(baskets)
    .then((itemsets) => {
      
    });
}

