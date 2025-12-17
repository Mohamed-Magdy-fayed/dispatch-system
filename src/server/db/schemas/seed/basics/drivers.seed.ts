import { db } from "../../../index";
import { drivers } from "../../core";
import { DriverStatus } from "../../types/driver.enum";

export async function seedDrivers() {
  return db
    .insert(drivers)
    .values([
      { name: "Driver 1", status: DriverStatus.Active },
      { name: "Driver 2", status: DriverStatus.Active },
    ])
    .returning();
}
