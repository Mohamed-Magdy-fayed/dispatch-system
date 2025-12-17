import { db } from "../../../index";
import { products } from "../../core";

export async function seedProducts() {
  return db
    .insert(products)
    .values([
      { name: "Box Small", price: "10.00", discription: "Small box" },
      { name: "Box Large", price: "20.00", discription: "Large box" },
    ])
    .returning();
}
