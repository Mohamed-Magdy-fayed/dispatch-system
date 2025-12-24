"use client";

import * as React from "react";
import type { DataTableContextProps } from "../types";

/* ============================================
   Context + Hook
============================================ */
export const DataTableContext =
  React.createContext<DataTableContextProps<any> | null>(null);

export function useDataTable<TData>() {
  const context = React.useContext(
    DataTableContext
  ) as DataTableContextProps<TData> | null;

  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }

  return context;
}
