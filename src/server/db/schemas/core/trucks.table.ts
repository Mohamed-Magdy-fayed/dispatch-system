import { index, pgTableCreator } from "drizzle-orm/pg-core";
import { drivers } from "./drivers.table";
import { createTable } from "./table";

export const trucks = createTable(
  "truck",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    model: d.varchar("model", { length: 50 }).notNull(),
    plateNumber: d.varchar("plate_number", { length: 50 }).notNull(),
    maxBoxes: d.integer().notNull(),
    driverId: d
      .integer()
      .notNull()
      .references(() => drivers.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("truck_plate_idx").on(t.plateNumber)]
);
