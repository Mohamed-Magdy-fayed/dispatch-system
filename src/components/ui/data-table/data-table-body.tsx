import * as React from "react";
import { useDataTable } from "./data-table-context";
import { TableBody, TableRow, TableCell } from "../table";
import type { CellContext } from "@tanstack/react-table";

export function DataTableBody() {
  const { table } = useDataTable();

  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => {
            const content =
              typeof cell.column.columnDef.cell === "function"
                ? cell.column.columnDef.cell(
                    cell.getContext() as CellContext<any, any>
                  )
                : cell.column.columnDef.cell ?? cell.getValue();

            return <TableCell key={cell.id}>{content}</TableCell>;
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
