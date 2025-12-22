import { ProductTable } from "@/modules/products/components/ProductTable";
import { getProducts } from "@/modules/products/actions/product.actions";

export const revalidate = 0;

export default async function ProductsPage() {
  const { success, data, error } = await getProducts();

  if (!success) {
    return (
      <div className="p-4 text-red-600">Error loading products: {error}</div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      {data && data.length > 0 ? (
        <ProductTable data={data} />
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}
