"use client";

import * as React from "react";
import { ProductTable } from "@/modules/products/components/ProductTable";
import type { Product } from "@/modules/products/types/product.types";
import { getProducts } from "@/modules/products/actions/product.actions";
import type { TableQueryState } from "@/components/ui/data-table/types";

export default function ProductPage() {
  const [data, setData] = React.useState<Product[]>([]);
  const [pageInfo, setPageInfo] = React.useState({
    page: 1,
    pageSize: 10,
    countWithFilters: 0,
    countTotal: 0,
  });
  const [queryState, setQueryStateInternal] = React.useState<TableQueryState>({
    filters: {},
    pageIndex: 0,
    pageSize: 10,
  });

  const setQueryState = React.useCallback(
    (
      newState: TableQueryState | ((prev: TableQueryState) => TableQueryState)
    ) => {
      setQueryStateInternal((prev) => {
        const updated =
          typeof newState === "function" ? newState(prev) : newState;
        // If sort changed, reset pageIndex to 0
        if (
          prev.sort?.field !== updated.sort?.field ||
          prev.sort?.direction !== updated.sort?.direction
        ) {
          updated.pageIndex = 0;
        }
        return updated;
      });
    },
    []
  );
  const [loading, setLoading] = React.useState(false);

  // Removed localFilters state as inputs are not needed

  const fetchData = React.useCallback(async () => {
    setLoading(true);

    try {
      const options = {
        page: queryState.pageIndex + 1,
        pageSize: queryState.pageSize,
        filters: queryState.filters,
        sort: queryState.sort,
      };

      // 🟡 CLIENT REQUEST LOG
      // console.log("🟡 [CLIENT] getProducts REQUEST", options);

      const result = await getProducts(options);

      // 🟢 CLIENT RESPONSE LOG
      // console.log("🟢 [CLIENT] getProducts RESPONSE", result);

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

  // Fetch data when queryState changes (for pagination, sorting, filters)
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle search button click - now just refetches current data
  const handleSearch = () => {
    fetchData(); // Fetch data on search
  };

  return (
    <div className="p-4">
      {/* {loading && <div>Loading...</div>} */}
      <ProductTable
        data={data}
        pageInfo={pageInfo}
        queryState={queryState}
        setQueryState={setQueryState}
        onSearch={handleSearch}
      />
    </div>
  );
}
