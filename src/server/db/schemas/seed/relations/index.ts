import { seedAreas } from "./areas.seed";
import { seedOrders } from "./orders.seed";
import { seedOrderProducts } from "./order-products.seed";
import { seedDispatches } from "./dispatch.seed";

export async function seedRelations(basics: any) {
  const areas = await seedAreas(basics);
  const orders = await seedOrders({ customers: basics.customers, areas });
  await seedOrderProducts({ orders, products: basics.products });
  await seedDispatches();
  return { areas, orders };
}
