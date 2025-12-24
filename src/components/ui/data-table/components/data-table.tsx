"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState, VisibilityState } from "@tanstack/react-table";
import { DataTableContext } from "./data-table-context";
import type { DataTableProps } from "../types";

/* ============================================
   DataTable Component (Provider + React Table)
============================================ */
export function DataTable<TData, TValue>({
  data,
  columns,
  children,
  pageMeta,
  queryState,
  setQueryState,
}: DataTableProps<TData, TValue>) {
  /* ================= UI-only states ================= */
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (queryState?.sort) {
      return [
        {
          id: queryState.sort.field,
          desc: queryState.sort.direction === "desc",
        },
      ];
    }
    return [];
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  /* ================= Sync sorting with server query state ================= */
  React.useEffect(() => {
    if (queryState?.sort) {
      setSorting([
        {
          id: queryState.sort.field,
          desc: queryState.sort.direction === "desc",
        },
      ]);
    } else {
      setSorting([]);
    }
  }, [queryState?.sort]);

  /* ================= React Table Instance ================= */
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: (updater) => {
      setSorting(updater);

      if (!setQueryState || !queryState) return;

      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const first = nextSorting[0];

      setQueryState({
        ...queryState,
        sort: first
          ? { field: first.id, direction: first.desc ? "desc" : "asc" }
          : undefined,
      });
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* ================= Provide context to children ================= */
  return (
    <DataTableContext.Provider
      value={{ table, pageMeta, queryState, setQueryState }}
    >
      {children}
    </DataTableContext.Provider>
  );
}
