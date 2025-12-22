// src/modules/products/columns/product.columns.ts
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../types/product.types";

// تعريف أعمدة الـ DataTable
export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    meta: { filterType: "text" },
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    meta: { filterType: "number" },
  },
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: false,
    meta: { filterType: "text" },
  },
];
