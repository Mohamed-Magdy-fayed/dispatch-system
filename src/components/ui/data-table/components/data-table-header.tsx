import * as React from "react";
import { useDataTable } from "./data-table-context";
import { TableHeader, TableRow, TableHead } from "../../table";
import type { HeaderContext } from "@tanstack/react-table";

export function DataTableHeader() {
  const { table } = useDataTable();

  return (
    <TableHeader>
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

            return <TableHead key={header.id}>{content}</TableHead>;
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
