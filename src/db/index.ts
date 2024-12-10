import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";
import { Customers, Invoices } from "./schema";

const pool = new Pool({
  connectionString: process.env.POSTGRESSQL_ENDPOINT,
  max: 20,
});

export const db = drizzle(pool, {
  schema: {
    Invoices,
    Customers,
  },
});
