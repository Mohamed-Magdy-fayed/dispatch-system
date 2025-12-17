import { seedRoutes } from "./routes.seed";
import { seedCustomers } from "./customers.seed";
import { seedProducts } from "./products.seed";
import { seedDrivers } from "./drivers.seed";

export async function seedBasics() {
  const routes = await seedRoutes();
  const customers = await seedCustomers();
  const products = await seedProducts();
  const drivers = await seedDrivers();

  return { routes, customers, products, drivers };
}
