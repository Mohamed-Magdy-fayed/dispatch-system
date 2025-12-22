"use client";

import * as React from "react";
import { TableCell } from "../table";

export function DataTableRowActions({ row }: { row: any }) {
  return (
    <TableCell>
      <button onClick={() => console.log("Edit", row.original)}>Edit</button>
      <button onClick={() => console.log("Delete", row.original)}>
        Delete
      </button>
    </TableCell>
  );
}
