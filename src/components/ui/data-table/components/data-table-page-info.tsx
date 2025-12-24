"use client";

import * as React from "react";
import { useDataTable } from "./data-table-context";

/* ============================================
   Pagination Info Display
============================================ */
export function DataTablePageInfo() {
  const { pageMeta } = useDataTable();
  if (!pageMeta) return null;

  const { pageIndex, pageSize, totalCount } = pageMeta;
  const from = pageIndex * pageSize + 1;
  const to = Math.min(from + pageSize - 1, totalCount);

  return (
    <div className="text-sm text-muted-foreground">
      {from} – {to} from {totalCount}
    </div>
  );
}
