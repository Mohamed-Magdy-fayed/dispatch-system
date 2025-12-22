"use client";

import * as React from "react";
import { useDataTable } from "./data-table-context";
import { Button } from "@/components/ui/button";

export function DataTablePagination() {
  const { table } = useDataTable();

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
