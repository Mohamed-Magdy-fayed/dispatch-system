"use client";

import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTableContext } from "./data-table-context";
import type { DataTableContextProps, DataTableProps } from "./types";

export function DataTable<TData, TValue>({
  data,
  columns,
  children,
  pageMeta, // ⭐ NEW
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // ================= Pagination Meta =================
  // ⭐ بنخزن meta داخليًا عشان نمررها لأي component

  const [internalPageMeta, setInternalPageMeta] = React.useState(pageMeta);

  // ⭐ لو السيرفر رجّع meta جديدة (Search / Page change)
  React.useEffect(() => {
    if (pageMeta) {
      setInternalPageMeta(pageMeta);
    }
  }, [pageMeta]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <DataTableContext.Provider
      value={
        {
          table,

          // ⭐ تمرير page meta
          pageMeta: internalPageMeta,

          // ⭐ هنحتاجها لما نعمل pagination server-side
          setPageMeta: setInternalPageMeta,
        } as DataTableContextProps<TData>
      }
    >
      {children}
    </DataTableContext.Provider>
  );
}
