import { db } from "../../../index";
import { orders } from "../../core";
import { OrderStatus } from "../../types/order.enum";

export async function seedOrders({ customers, areas }: any) {
  return db
    .insert(orders)
    .values([
      {
        code: "ORD-1",
        name: "Order 1",
        boxesCount: 5,
        status: OrderStatus.Pending,
        customerId: customers[0].id,
        areaId: areas[0].id,
      },
      {
        code: "ORD-2",
        name: "Order 2",
        boxesCount: 10,
        status: OrderStatus.Pending,
        customerId: customers[1].id,
        areaId: areas[1].id,
      },
    ])
    .returning();
}
