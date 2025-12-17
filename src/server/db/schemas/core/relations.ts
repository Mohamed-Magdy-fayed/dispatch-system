// this file will get very big as we add more tables and relations
// so we can split it into multiple files later if needed
// or simply include relations in each table file itself

import { relations } from "drizzle-orm";
import { areas } from "./areas.table";
import { customers } from "./customers.table";
import { dispatch_orders } from "./dispatch-orders.table";
import { dispatch_routes } from "./dispatch-routes.table";
import { dispatches } from "./dispatches.table";
import { drivers } from "./drivers.table";
import { order_products } from "./order_products";
import { orders } from "./orders.table";
import { products } from "./products.table";
import { routes } from "./routes.table";
import { trucks } from "./trucks.table";

// ========================== CUSTOMERS ==========================
export const customersRelations = relations(customers, ({ one, many }) => ({
  orders: many(orders), // كل عميل ممكن يكون عنده أكثر من order
}));

// ========================== ORDERS ==========================
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }), // كل order تابع لعميل واحد

  area: one(areas, {
    fields: [orders.areaId],
    references: [areas.id],
  }), // كل order مرتبط بمنطقة واحدة

  dispatch_orders: many(dispatch_orders), // كل order ممكن يظهر في أكثر من dispatch
  order_products: many(order_products), // كل order ممكن يحتوي على أكثر من product
}));

// ========================== AREAS ==========================
export const areasRelations = relations(areas, ({ one, many }) => ({
  route: one(routes, {
    fields: [areas.routeId],
    references: [routes.id],
  }), // كل area مرتبط بـ route واحد

  orders: many(orders), // كل area ممكن يكون لها أكثر من order
}));

// ========================== ROUTES ==========================
export const routesRelations = relations(routes, ({ one, many }) => ({
  areas: many(areas), // كل route ممكن يكون له أكثر من area
  dispatch_routes: many(dispatch_routes), // كل route ممكن يظهر في أكثر من dispatch
}));

// ========================== DISPATCHES ==========================
export const dispatchesRelations = relations(dispatches, ({ one, many }) => ({
  dispatch_orders: many(dispatch_orders), // كل dispatch ممكن يحتوي على أكثر من order
  dispatch_routes: many(dispatch_routes), // كل dispatch ممكن يحتوي على أكثر من route
}));

// ========================== DISPATCH_ORDERS ==========================
export const dispatch_ordersRelations = relations(
  dispatch_orders,
  ({ one, many }) => ({
    dispatch: one(dispatches, {
      fields: [dispatch_orders.dispatchId],
      references: [dispatches.id],
    }),
    order: one(orders, {
      fields: [dispatch_orders.orderId],
      references: [orders.id],
    }),
  }),
);

// ========================== DISPATCH_ROUTES ==========================
export const dispatch_routesRelations = relations(
  dispatch_routes,
  ({ one, many }) => ({
    dispatch: one(dispatches, {
      fields: [dispatch_routes.dispatchId],
      references: [dispatches.id],
    }),
    route: one(routes, {
      fields: [dispatch_routes.routeId],
      references: [routes.id],
    }),
  }),
);

// ========================== PRODUCTS ==========================
export const productsRelations = relations(products, ({ one, many }) => ({
  order_products: many(order_products), // كل product ممكن يظهر في أكثر من order
}));

// ========================== ORDER_PRODUCTS ==========================
export const order_productsRelations = relations(
  order_products,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [order_products.orderId],
      references: [orders.id],
    }),
    product: one(products, {
      fields: [order_products.productId],
      references: [products.id],
    }),
  }),
);

// ========================== DRIVERS ==========================
export const driversRelations = relations(drivers, ({ one, many }) => ({
  trucks: many(trucks), // كل driver ممكن يقود أكثر من truck (حسب التصميم)
}));

// ========================== TRUCKS ==========================
export const trucksRelations = relations(trucks, ({ one, many }) => ({
  driver: one(drivers, {
    fields: [trucks.driverId],
    references: [drivers.id],
  }),
}));
