import { index, pgTableCreator } from "drizzle-orm/pg-core";
import { customers } from "./customers.table";
import { routes } from "./routes.table";
import { createTable } from "./table";
import { areas } from "./areas.table";
import { OrderStatus } from "../types/order.enum";

export const orders = createTable(
  "order",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    code: d.varchar("code", { length: 50 }).notNull(), // ← العمود الجديد
    customerId: d
      .integer()
      .notNull()
      .references(() => customers.id),
    areaId: d
      .integer()
      .notNull()
      .references(() => areas.id),

    name: d.varchar("name", { length: 256 }).notNull(),
    boxesCount: d.integer().notNull(),
    status: d
      .varchar("status", { length: 30 })
      .$type<OrderStatus>()
      .$default(() => OrderStatus.Pending)
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("name_idx").on(t.name),
    index("areaId_idx").on(t.areaId),
    index("order_code_idx").on(t.code),
  ]
);
