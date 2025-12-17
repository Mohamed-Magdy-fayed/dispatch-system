import { index, pgTableCreator } from "drizzle-orm/pg-core";
import { createTable } from "./table";

export const routes = createTable(
  "route",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    code: d.varchar("code", { length: 50 }).notNull(),
    name: d.varchar("name", { length: 256 }).notNull(),
    isActive: d.boolean().default(true).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("route_code_idx").on(t.code),
    index("route_name_idx").on(t.name),
  ]
);
