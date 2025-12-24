"use client";

import * as React from "react";
import { useDataTable } from "./data-table-context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";

/* ============================================
   Column Visibility Toggle
============================================ */
export function DataTableViewOptions() {
  const { table } = useDataTable();
  const columns = table.getAllColumns().filter((col) => col.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-2 border rounded">Columns</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuGroup>
          {columns.map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              checked={col.getIsVisible()}
              onCheckedChange={(checked) => col.toggleVisibility(!!checked)}
              onSelect={(e) => e.preventDefault()} // منع إغلاق القائمة عند الاختيار
            >
              {col.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
