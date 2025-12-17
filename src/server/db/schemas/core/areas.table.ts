import { index, pgTableCreator } from "drizzle-orm/pg-core"; // unsed import
import { routes } from "./routes.table";
import { createTable } from "./table";

export const areas = createTable(
  "area",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar("name", { length: 256 }).notNull(),
    routeId: d
      .integer()
      .notNull()
      .references(
        () =>
          routes.id /* need to add cascading here Ex. {onDelete: "CASCADE"} */,
      ),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date()) // can be changed to .defaultNow() to avoid timezone issues
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("area_route_idx").on(t.routeId),
    index("area_route_name_idx").on(t.routeId, t.name),
  ],
);
