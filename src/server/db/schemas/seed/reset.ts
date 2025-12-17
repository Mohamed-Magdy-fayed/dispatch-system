import { db } from "../../index";
import {
  dispatch_orders,
  dispatch_routes,
  dispatches,
  order_products,
  orders,
  areas,
  routes,
  customers,
  products,
  drivers,
} from "../core/index";

export async function resetDatabase() {
  await db.delete(dispatch_orders);
  await db.delete(dispatch_routes);
  await db.delete(dispatches);
  await db.delete(order_products);
  await db.delete(orders);
  await db.delete(areas);
  await db.delete(routes);
  await db.delete(customers);
  await db.delete(products);
  await db.delete(drivers);
}
