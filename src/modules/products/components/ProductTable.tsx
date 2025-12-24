"use client";

import * as React from "react";
import {
  DataTable,
  DataTableBody,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableViewOptions,
} from "@/components/ui/data-table";
import { productColumns } from "./ProductColumns";
import { ProductsSearchBTN } from "./ProductsSearchBTN";
import type { Product } from "../types/product.types";
import type { PageInfo } from "../types/product.types";
import type { TableQueryState } from "@/components/ui/data-table/types";

interface Props {
  data: Product[];
  pageInfo: PageInfo;
  queryState?: TableQueryState;
  setQueryState?: React.Dispatch<React.SetStateAction<TableQueryState>>;
  onSearch?: () => void;
}

export function ProductTable({
  data,
  pageInfo,
  queryState,
  setQueryState,
  onSearch,
}: Props) {
  // Convert PageInfo to PageMeta
  const pageMeta = {
    pageIndex: pageInfo.page - 1, // Convert 1-based to 0-based
    pageSize: pageInfo.pageSize,
    totalCount: pageInfo.countWithFilters,
  };

  return (
    <DataTable
      data={data}
      columns={productColumns}
      pageMeta={pageMeta}
      queryState={queryState}
      setQueryState={setQueryState}
    >
      {/* View Options and Search Button */}
      <div className="flex justify-end items-center gap-2 mb-2">
        <ProductsSearchBTN onSearch={onSearch} />
        <DataTableViewOptions />
      </div>

      <table className="w-full">
        <DataTableColumnHeader />
        <DataTableBody />
      </table>

      <DataTablePagination />
    </DataTable>
  );
}
