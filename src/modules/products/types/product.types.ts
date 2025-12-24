import { z } from "zod";

// =====================
// ✅ Product Type
// =====================
export interface Product {
  id: number;
  name: string;
  price: string; // السعر مخزن كـ string في DB
  description?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

// =====================
// ✅ Zod Schemas
// =====================
export const productFields = {
  name: z
    .string()
    .min(1, "Product name is required")
    .max(256, "Product name cannot exceed 256 characters"),
  price: z.number().positive("Price must be greater than 0"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
};

// Create schema
export const createProductSchema = z.object(productFields);

// Update schema
export const updateProductSchema = z.object({
  id: z.number(), // لازم id يكون موجود في update
  ...productFields,
});

// =====================
// ✅ Pagination Types
// =====================
export interface PageInfo {
  page: number;
  pageSize: number;
  countWithFilters: number;
  countTotal: number;
}

// =====================
// ✅ getAll return type
// =====================
export interface GetAllProductsResult {
  data: Product[];
  pageInfo: PageInfo;
}

// =====================
// ✅ getAll options type
// =====================
export interface GetProductsOptions {
  page?: number;
  pageSize?: number;
  filters?: {
    name?: string;
    description?: string;
  };
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
}
