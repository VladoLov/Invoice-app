import { AVAILABLE_STATUSES } from "@/data/invoices";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type Status = (typeof AVAILABLE_STATUSES)[number]["id"];

/* export const statusEnum = pgEnum("status", [
  "open",
  "paid",
  "void",
  "uncollectible",
]); */
// we do same but we add this dynamic
const statuses = AVAILABLE_STATUSES.map(({ id }) => id);
export const statusEnum = pgEnum(
  "status",
  statuses as [Status, ...Array<Status>]
);

export const Invoices = pgTable("invoices", {
  id: serial("id").primaryKey().notNull(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  userId: text("userId").notNull(),
  customerId: integer("customerId")
    .notNull()
    .references(() => Customers.id),
  status: statusEnum("status").notNull(),
});
export const Customers = pgTable("customers", {
  id: serial("id").primaryKey().notNull(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  userId: text("userId").notNull(),
});