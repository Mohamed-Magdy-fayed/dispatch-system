"use client";

import * as React from "react";
import { useDataTable } from "./data-table-context";
import { Button } from "@/components/ui/button";

/* ============================================
   Pagination Component
============================================ */
export function DataTablePagination() {
  const { pageMeta, queryState, setQueryState, table } = useDataTable();

  // Fallback for client-side pagination
  if (!pageMeta || !queryState || !setQueryState) {
    return (
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    );
  }

  const { pageIndex, pageSize, totalCount } = pageMeta;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {pageIndex * pageSize + 1} to{" "}
        {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount}{" "}
        results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setQueryState({ ...queryState, pageIndex: pageIndex - 1 })
          }
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setQueryState({ ...queryState, pageIndex: pageIndex + 1 })
          }
          disabled={pageIndex >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
