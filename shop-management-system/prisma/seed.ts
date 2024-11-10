import { PrismaClient, Roles } from '@prisma/client';
const prisma = new PrismaClient();

export async function seed() {
  // Seed Products
  const products = [
    { name: 'Product 1', image: 'image1.jpg', price: 10.0, stock: 100, description: 'Description 1', category: 'Category 1', createdAt: new Date().toISOString() },
    { name: 'Product 2', image: 'image2.jpg', price: 20.0, stock: 50, description: 'Description 2', category: 'Category 2', createdAt: new Date().toISOString() },
    { name: 'Product 3', image: 'image3.jpg', price: 30.0, stock: 200, description: 'Description 3', category: 'Category 3', createdAt: new Date().toISOString() },
    { name: 'Product 4', image: 'image4.jpg', price: 40.0, stock: 150, description: 'Description 4', category: 'Category 4', createdAt: new Date().toISOString() },
    { name: 'Product 5', image: 'image5.jpg', price: 50.0, stock: 80, description: 'Description 5', category: 'Category 5', createdAt: new Date().toISOString() },
    { name: 'Product 6', image: 'image6.jpg', price: 60.0, stock: 120, description: 'Description 6', category: 'Category 6', createdAt: new Date().toISOString() },
    { name: 'Product 7', image: 'image7.jpg', price: 70.0, stock: 60, description: 'Description 7', category: 'Category 7', createdAt: new Date().toISOString() },
    { name: 'Product 8', image: 'image8.jpg', price: 80.0, stock: 40, description: 'Description 8', category: 'Category 8', createdAt: new Date().toISOString() },
    { name: 'Product 9', image: 'image9.jpg', price: 90.0, stock: 30, description: 'Description 9', category: 'Category 9', createdAt: new Date().toISOString() },
    { name: 'Product 10', image: 'image10.jpg', price: 100.0, stock: 20, description: 'Description 10', category: 'Category 10', createdAt: new Date().toISOString() },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  // Seed Users
  const users = [
    { name: 'User 1', email: 'user1@example.com', password: 'password1', role: Roles.ADMIN },
    { name: 'User 2', email: 'user2@example.com', password: 'password2', role: Roles.Employee },
    { name: 'User 3', email: 'user3@example.com', password: 'password3', role: Roles.Employee },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log('Seed data created successfully.');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
