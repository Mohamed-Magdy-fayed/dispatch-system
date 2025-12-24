"use client";

import * as React from "react";
import { ProductTable } from "./ProductTable";
import type {
  Product,
  PageInfo,
  GetProductsOptions,
} from "../types/product.types";
import { getProducts } from "../actions/product.actions";
import type { TableQueryState } from "@/components/ui/data-table/types";

interface Props {
  initialData: Product[];
  initialPageInfo: PageInfo;
}

export function ProductsTableWrapper({ initialData, initialPageInfo }: Props) {
  // State للبيانات
  const [data, setData] = React.useState(initialData);
  const [pageInfo, setPageInfo] = React.useState(initialPageInfo);

  // Local state for filter inputs
  const [localFilters, setLocalFilters] = React.useState({
    name: "",
    description: "",
  });

  // Use queryState to manage everything
  const [queryState, setQueryState] = React.useState<TableQueryState>({
    filters: {},
    sort: undefined,
    pageIndex: 0,
    pageSize: 10,
  });

  const [loading, setLoading] = React.useState(false);

  // 🔹 الدالة اللي هتجلب البيانات
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProducts({
        page: queryState.pageIndex + 1,
        pageSize: queryState.pageSize,
        filters: queryState.filters,
        sort: queryState.sort,
      });

      if (result.success) {
        setData(result.data.data);
        setPageInfo(result.data.pageInfo);
      } else {
        console.error(result.error);
      }
    } finally {
      setLoading(false);
    }
  }, [queryState]);

  // Fetch data when queryState changes (for pagination, sorting)
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle search button click
  const handleSearch = () => {
    setQueryState((prev) => ({
      ...prev,
      filters: {
        name: localFilters.name || undefined,
        description: localFilters.description || undefined,
      },
      pageIndex: 0, // Reset to first page on search
    }));
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      <div className="flex gap-2 mb-2">
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* 🔹 الجدول نفسه */}
      <ProductTable
        data={data}
        pageInfo={pageInfo}
        queryState={queryState}
        setQueryState={setQueryState}
      />
    </div>
  );
}
