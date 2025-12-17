import { db } from "../../../index";
import { drivers } from "../../core";
import { DispatchStatus } from "../../types/Dispatch.enum";

export async function seedDrivers() {
  return db
    .insert(drivers)
    .values([
      { name: "Driver 1", status: DispatchStatus.Pending },
      { name: "Driver 2", status: DispatchStatus.Pending },
    ])
    .returning();
}
