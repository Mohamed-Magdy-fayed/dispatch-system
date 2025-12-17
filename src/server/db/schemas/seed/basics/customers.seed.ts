import { db } from "../../../index";
import { customers } from "../../core";

export async function seedCustomers() {
  return db
    .insert(customers)
    .values([
      { name: "Ahmed", phone: "0100000001", email: "ahmed@example.com" },
      { name: "Omar", phone: "0100000002", email: "omar@example.com" },
    ])
    .returning();
}
