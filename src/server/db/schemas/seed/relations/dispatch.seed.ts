import { db } from "../../../index";
import { dispatches } from "../../core/dispatches.table";

import { DispatchStatus } from "../../types/Dispatch.enum";

export async function seedDispatches() {
  return db
    .insert(dispatches)
    .values([
      {
        code: "DSP-1",
        date: new Date().toISOString(),
        status: DispatchStatus.Pending,
      },
      {
        code: "DSP-2",
        date: new Date().toISOString(),
        status: DispatchStatus.Pending,
      },
    ])
    .returning();
}
