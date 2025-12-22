"use client";

import * as React from "react";
import { useDataTable } from "./data-table-context";
import { Input } from "@/components/ui/input";
import type { DataTableToolbarProps } from "./types";

export function DataTableToolbar({ columnKey }: DataTableToolbarProps) {
  const { table } = useDataTable();

  // لو columnKey مش متحدد، نختار أول عمود ممكن نعمل له filter من نوع text
  const searchColumn =
    columnKey || table.getAllColumns().find((col) => col.getCanFilter())?.id;

  if (!searchColumn) return null;

  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Search..."
        value={
          (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
        }
        onChange={(e) =>
          table.getColumn(searchColumn)?.setFilterValue(e.target.value)
        }
      />
    </div>
  );
}
