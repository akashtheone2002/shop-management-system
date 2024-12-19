// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/node-postgres';

// You can specify any property from the node-postgres connection options
export const db = drizzle({ 
  connection: { 
    connectionString: "postgresql://postgres:19122000@localhost:5432/shop-management-system",
  }
});
 