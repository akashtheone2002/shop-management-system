
// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, uuid, varchar, text, numeric, integer, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const Entity = pgTable('Entity', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  entityType: varchar('entityType', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  number: varchar('number', { length: 50 }),
  password: varchar('password', { length: 255 }),
  role: varchar('role', { length: 50 }),
  image: text('image'),
  price: numeric('price'),
  quantity: integer('quantity'),
  description: text('description'),
  category: varchar('category', { length: 255 }),
  jsonPayload: text('jsonPayload'),
  modifiedOn: timestamp('modifiedOn'),
  modifiedBy: uuid('modifiedBy')
});

// You can specify any property from the node-postgres connection options
const db = drizzle({ 
  connection: { 
    connectionString: "postgresql://postgres:19122000@localhost:5432/shop-management-system",
  }
});
 

const result = await db.select("Entity");

console.log(result);