import { db } from "../../../index";
import { order_products } from "../../core";

interface SeedOrderProduct {
  orderId: number;
  productId: number;
}

export async function seedOrderProducts({
  orders,
  products,
}: {
  orders: { id: number }[];
  products: { id: number }[];
}) {
  const values: SeedOrderProduct[] = [];

  orders.forEach((o) => {
    products.forEach((p) => {
      values.push({ orderId: o.id, productId: p.id });
    });
  });

  return db.insert(order_products).values(values).returning();
}
