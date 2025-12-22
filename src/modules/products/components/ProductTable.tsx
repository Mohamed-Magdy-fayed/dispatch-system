"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import { ProductColumnHeader } from "./ProductColumnHeader";
import { ProductBody } from "./ProductBody";
import { ProductToolbar } from "./ProductToolbar";
import { ProductViewOptions } from "./ProductViewOptions";
import { ProductPagination } from "./ProductPagination";
import { productColumns } from "./product.columns";
import type { Product } from "../types/product.types";

interface Props {
  data: Product[];
}

export function ProductTable({ data }: Props) {
  return (
    <DataTable data={data} columns={productColumns}>
      {/* <ProductToolbar /> */}
      {/* wrapper لتحريك ProductViewOptions لليمين */}
      <div className="flex justify-end mb-2">
        <ProductViewOptions />
      </div>
      <table className="w-full">
        <ProductColumnHeader />
        <ProductBody />
      </table>
      <ProductPagination />
    </DataTable>
  );
}
