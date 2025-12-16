import { index } from "drizzle-orm/pg-core";
import { createTable } from "./table";
import { dispatches } from "./dispatches.table";
import { routes } from "./routes.table";

export const dispatch_routes = createTable(
  "dispatch_routes",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    dispatchId: d
      .integer()
      .notNull()
      .references(() => dispatches.id),
    routeId: d
      .integer()
      .notNull()
      .references(() => routes.id),
    boxesCount: d.integer().notNull(), // عدد الصناديق المخصصة لهذا الـ Route في هذا الـ Dispatch
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("dispatch_route_idx").on(t.dispatchId, t.routeId)]
);
