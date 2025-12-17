import { db } from "../../../index";
import { routes } from "../../core";

export async function seedRoutes() {
  return db
    .insert(routes)
    .values([
      { code: "R-01", name: "Route 1" },
      { code: "R-02", name: "Route 2" },
    ])
    .returning();
}
