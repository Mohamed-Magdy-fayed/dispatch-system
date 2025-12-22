import { revalidatePath } from "next/cache";
import {
  ProductService,
  createProductSchema,
  updateProductSchema,
} from "../index";

const productService = new ProductService();

export async function createProduct(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: (formData.get("description") as string) || undefined,
    };

    const validated = createProductSchema.parse(data);
    const result = await productService.create(validated);

    revalidatePath("/products");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

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

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteProduct(id: number) {
  try {
    await productService.delete(id);
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProducts() {
  try {
    const products = await productService.getAll();
    return { success: true, data: products };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

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
