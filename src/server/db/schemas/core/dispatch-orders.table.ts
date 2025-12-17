import { index } from "drizzle-orm/pg-core";
import { createTable } from "./table";
import { dispatches } from "./dispatches.table";
import { orders } from "./orders.table";

export const dispatch_orders = createTable(
  "dispatch_orders",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    dispatchId: d
      .integer()
      .notNull()
      .references(() => dispatches.id),
    orderId: d
      .integer()
      .notNull()
      .references(() => orders.id),
    boxesCount: d.integer().notNull(), // عدد الصناديق من هذا الطلب ضمن هذا الـ Dispatch
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("dispatch_order_idx").on(t.dispatchId, t.orderId)]
);
