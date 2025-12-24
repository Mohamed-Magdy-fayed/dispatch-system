import { db } from "../../../index";
import { products } from "../../core";

export async function seedProducts() {
  return db
    .insert(products)
    .values([
      { name: "Box Small", price: "10.00", description: "Small box" },
      { name: "Box Large", price: "20.00", description: "Large box" },
    ])
    .returning();
}
