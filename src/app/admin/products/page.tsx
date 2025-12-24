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
  const [queryState, setQueryState] = React.useState<TableQueryState>({
    filters: {},
    pageIndex: 0,
    pageSize: 10,
  });
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
      const result = await getProducts(options);
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

  // Initial fetch on mount (page refresh)
  React.useEffect(() => {
    fetchData();
  }, []); // Empty dependency array for mount only

  // Handle search button click - now just refetches current data
  const handleSearch = () => {
    fetchData(); // Fetch data on search
  };

  return (
    <div className="p-4">
      {loading && <div>Loading...</div>}
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
