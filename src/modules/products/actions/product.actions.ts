"use server";

import { revalidatePath } from "next/cache";
import {
  ProductService,
  createProductSchema,
  updateProductSchema,
} from "../index";
import type { GetAllProductsResult, GetProductsOptions } from "../types/product.types"; // ✅ type واضح

const productService = new ProductService();

/* =========================
   Create
========================= */

export async function createProduct(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: (formData.get("description") as string) || undefined,
    };

    const validated = createProductSchema.parse(data);
    const result = await productService.create(validated);

    revalidatePath("/admin/products");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/* =========================
   Update
========================= */
export async function updateProduct(formData: FormData) {
  try {
    const id = parseInt(formData.get("id") as string);

    const data = {
      id,
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: (formData.get("description") as string) || undefined,
    };

    const validated = updateProductSchema.parse(data);
    await productService.update(validated);

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/* =========================
   Delete
========================= */
export async function deleteProduct(id: number) {
  try {
    await productService.delete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/* =========================
   Get All (FIX HERE)
========================= */
export async function getProducts(
  options?: GetProductsOptions
): Promise<
  | { success: true; data: GetAllProductsResult }
  | { success: false; error: string }
> {
  try {
    const result = await productService.getAll(options);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


/* =========================
   Get By Id
========================= */
export async function getProductById(id: number) {
  try {
    const product = await productService.getById(id);
    return { success: true, data: product };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
