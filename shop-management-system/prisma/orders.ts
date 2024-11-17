import { ITransaction } from "@/type";
import { PrismaClient } from "@prisma/client";
import { TransactionHistoryParams, TransactionHistoryResponse } from "@/type/transaction/transaction";

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
    // Fetch the transaction by its ID
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId, // Match the transaction ID
      },
      include: {
        customer: true, // Include customer data
        orders: true, // Include orders data
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

