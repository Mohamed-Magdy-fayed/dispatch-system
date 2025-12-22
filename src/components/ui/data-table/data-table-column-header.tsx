"use client";

import * as React from "react";
import { useDataTable } from "./data-table-context";
import { TableHead, TableRow } from "../table";
import type { HeaderContext } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColumnFilterProps, FilterType, ColumnFilterMeta } from "./types";

// ============================================
// 2️⃣ Column Filter Component
// ============================================
function ColumnFilter({
  headerContext,
  filterType = "text",
  filterOptions,
}: ColumnFilterProps) {
  const column = headerContext.column;
  const filterValue = column.getFilterValue();

  switch (filterType) {
    case "text":
      return (
        <Input
          placeholder="Search..."
          value={typeof filterValue === "string" ? filterValue : ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="mt-1 w-full"
        />
      );

    case "number":
      return (
        <Input
          type="number"
          placeholder="Number..."
          value={typeof filterValue === "number" ? filterValue : ""}
          onChange={(e) => column.setFilterValue(Number(e.target.value))}
          className="mt-1 w-full"
        />
      );

    case "number-range": {
      const [min, max] = Array.isArray(filterValue) ? filterValue : ["", ""];
      return (
        <div className="flex space-x-2 mt-1">
          <Input
            type="number"
            placeholder="Min"
            value={min as string}
            onChange={(e) => column.setFilterValue([e.target.value, max])}
            className="w-1/2"
          />
          <Input
            type="number"
            placeholder="Max"
            value={max as string}
            onChange={(e) => column.setFilterValue([min, e.target.value])}
            className="w-1/2"
          />
        </div>
      );
    }

    case "date":
      return (
        <Input
          type="date"
          value={typeof filterValue === "string" ? filterValue : ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="mt-1 w-full"
        />
      );

    case "date-range": {
      const [from, to] = Array.isArray(filterValue) ? filterValue : ["", ""];
      return (
        <div className="flex space-x-2 mt-1">
          <Input
            type="date"
            value={from as string}
            onChange={(e) => column.setFilterValue([e.target.value, to])}
            className="w-1/2"
          />
          <Input
            type="date"
            value={to as string}
            onChange={(e) => column.setFilterValue([from, e.target.value])}
            className="w-1/2"
          />
        </div>
      );
    }

    case "select":
      return (
        <Select
          value={typeof filterValue === "string" ? filterValue : ""}
          onValueChange={(value) => column.setFilterValue(value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {filterOptions?.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    default:
      return null;
  }
}

// ============================================
// 3️⃣ Main Header Component
// ============================================
export function DataTableColumnHeader() {
  const { table } = useDataTable();

  return (
    <thead className="[&_tr]:border-b">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const content = header.isPlaceholder
              ? null
              : typeof header.column.columnDef.header === "function"
              ? (
                  header.column.columnDef.header as (
                    ctx: HeaderContext<any, any>
                  ) => React.ReactNode
                )(header.getContext())
              : header.column.columnDef.header;

            // read filterType and options from column.meta (cast to ColumnFilterMeta)
            const meta = header.column.columnDef.meta as
              | ColumnFilterMeta
              | undefined;
            const filterType = meta?.filterType;
            const filterOptions = meta?.filterOptions;

            return (
              <TableHead key={header.id}>
                <div className="flex flex-col space-y-1">
                  <div>{content}</div>
                  {filterType && (
                    <ColumnFilter
                      headerContext={header.getContext()}
                      filterType={filterType}
                      filterOptions={filterOptions}
                    />
                  )}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </thead>
  );
}
