
import { index, pgTableCreator } from "drizzle-orm/pg-core";
import { createTable } from "./table";



export const customers = createTable(
  "customers",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar("name", { length: 100 }).notNull(),
    phone: d.varchar("phone", { length: 30 }).notNull(),
    email: d.varchar("email", { length: 150 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("customer_phone_idx").on(t.phone),
    index("customer_name_idx").on(t.name),
  ]
);
