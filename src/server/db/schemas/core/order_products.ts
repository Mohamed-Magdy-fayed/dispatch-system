import { index } from "drizzle-orm/pg-core";
import { dispatches } from "./dispatches.table";
import { orders } from "./orders.table";
import { products } from "./products.table";
import { createTable } from "./table";

export const order_products = createTable(
  "order_products",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    orderId: d
      .integer()
      .notNull()
      .references(() => orders.id),
    productId: d
      .integer()
      .notNull()
      .references(() => products.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("orderId_productId_idx").on(t.orderId, t.productId)],
);
