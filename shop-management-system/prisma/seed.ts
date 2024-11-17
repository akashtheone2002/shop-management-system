import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      password: 'password123',
      role: 'ADMIN',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      password: 'password123',
      role: 'Employee',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      password: 'password123',
      role: 'Employee',
    },
  });

  // Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'David Williams',
      email: 'david.williams@example.com',
      number: '1234567890',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      number: '2345678901',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      number: '3456789012',
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      number: '4567890123',
    },
  });

  // Create Products with real names
  const products = [
    {  name: 'Apple iPhone 13', price: 799, stock: 50, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Samsung Galaxy S21', price: 699, stock: 40, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Sony WH-1000XM4', price: 349, stock: 30, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Dell XPS 13', price: 999, stock: 20, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Apple MacBook Pro', price: 1299, stock: 15, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Bose QuietComfort 35', price: 299, stock: 25, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Amazon Echo Dot', price: 49, stock: 100, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Google Nest Hub', price: 89, stock: 50, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Fitbit Charge 5', price: 149, stock: 60, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { name: 'Nintendo Switch', price: 299, stock: 30, category: 'Electronics', image: 'https://via.placeholder.com/150' },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        description: `Description for ${productData.name}`,
        modifiedBy: user1.id,
      },
    });
    createdProducts.push(product);
  }

  // Create Orders and Transactions
  const orders = [];
  for (let i = 1; i <= 20; i++) {
    const product = createdProducts[i % createdProducts.length];
    const order = await prisma.order.create({
      data: {
        productId: product.id,
        quantity: Math.floor(Math.random() * 10) + 1,
        price: product.price,
        image: product.image,
        transactionId: '', // Placeholder for now
      },
    });
    orders.push(order);
  }

  const transactions = [
    { customerId: customer1.id, createdBy: user1.id },
    { customerId: customer2.id, createdBy: user2.id },
    { customerId: customer3.id, createdBy: user3.id },
    { customerId: customer4.id, createdBy: user2.id },
    { customerId: customer1.id, createdBy: user3.id },
  ];

  for (const [index, txn] of transactions.entries()) {
    const transactionOrders = orders.slice(index * 4, (index + 1) * 4);
    const transaction = await prisma.transaction.create({
      data: {
        customerId: txn.customerId,
        totalPrice: transactionOrders.reduce((total, order) => total + order.price * order.quantity, 0),
        orders: { connect: transactionOrders.map(order => ({ id: order.id })) },
        createdBy: txn.createdBy,
        boughtOn: new Date(),
      },
    });

    // Update the orders with the transactionId
    for (const order of transactionOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { transactionId: transaction.id },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
