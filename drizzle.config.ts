import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config({
  path: "./.env.local",
});
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: String(process.env.POSTGRESSQL_ENDPOINT),
  },
});
