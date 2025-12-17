import { index } from "drizzle-orm/pg-core";
import { DispatchStatus } from "../types/Dispatch.enum";
import { createTable } from "./table";
import { DriverStatus } from "../types/driver.enum";

export const drivers = createTable(
  "driver",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar("name", { length: 50 }).notNull(),
    status: d
      .varchar("status", { length: 30 })
      .$type<DriverStatus>()
      .$default(() => DriverStatus.Active)
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("driver_name_idx").on(t.name)]
);
