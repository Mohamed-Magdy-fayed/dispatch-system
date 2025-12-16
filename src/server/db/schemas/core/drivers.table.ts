import { index } from "drizzle-orm/pg-core";
import { createTable } from "./table";
import { DispatchStatus } from "../types/Dispatch.enum";

export const drivers = createTable(
  "driver",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    date: d.date().notNull(),
    status: d
      .varchar("status", { length: 30 })
      .$type<DispatchStatus>()
      .$default(() => DispatchStatus.Pending)
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("dispatch_date_idx").on(t.date)]
);
