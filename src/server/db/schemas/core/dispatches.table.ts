import { index } from "drizzle-orm/pg-core";
import { DispatchStatus } from "../types/Dispatch.enum";
import { createTable } from "./table";

// export const DispatchStatusEnum = ["pending", "in_progress", "completed", "cancelled"] as const;
// export const DispatchStatusEnumPg = pgEnum("DispatchStatusEnumPg", DispatchStatusEnum);
// export type DispatchStatusEnumPg = typeof DispatchStatusEnumPg[number];

export const dispatches = createTable(
  "dispatch",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    code: d.varchar("code", { length: 50 }).notNull(), // ← العمود الجديد
    date: d.date().notNull(),
    status: d
      .varchar("status", { length: 30 })
      .$type<DispatchStatus>()
      // defining drizzle enums can be done using pgEnum for native compatibility as example above even in other files if shared
      .$default(() => DispatchStatus.Pending)
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("dispatch_date_idx").on(t.date),
    index("dispatch_code_idx").on(t.code),
  ],
);
