// src/modules/products/components/product.columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../types/product.types";
import { ProductRowActions } from "./ProductRowActions";

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
    enableSorting: true,
    meta: { filterType: "text" },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ProductRowActions row={row} />,
  },
];
