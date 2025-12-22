import { z } from "zod";

// ✅ TypeScript Type for Product
export interface Product {
  id: number;
  name: string;
  price: string; // لاحظ إنك بتخزن السعر كـ string في DB
  description?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

// Base Schema matching DB schema exactly
export const productFields = {
  name: z
    .string()
    .min(1, "Product name is required")
    .max(256, "Product name cannot exceed 256 characters"),
  price: z.number().positive("Price must be greater than 0"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(), // nullable في DB
};

// Create schema
export const createProductSchema = z.object(productFields);

// Update schema
export const updateProductSchema = z.object({
  id: z.number(), // لازم id يكون موجود في update
  ...productFields,
});
