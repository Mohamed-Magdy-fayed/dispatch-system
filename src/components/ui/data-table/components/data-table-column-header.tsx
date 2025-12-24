"use client";

import * as React from "react";
import { TableRow, TableHead } from "../../table";
import type { HeaderContext } from "@tanstack/react-table";
import type { ColumnFilterMeta } from "../types";
import { ColumnFilter } from "./Column-Filter";
import { useDataTable } from "./data-table-context";

/* ============================================
   Unified Column Header (sorting + filters)
============================================ */
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

            const meta = header.column.columnDef.meta as
              | ColumnFilterMeta
              | undefined;

            return (
              <TableHead key={header.id}>
                <div className="flex flex-col space-y-1">
                  {/* Sorting */}
                  {header.column.getCanSort() ? (
                    <button
                      className="flex items-center justify-between hover:bg-muted/50 rounded px-1 py-1 -mx-1 -my-1"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>{content}</span>
                      {/* Sorting Icons */}
                      {{
                        asc: (
                          <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ),
                        desc: (
                          <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        ),
                      }[header.column.getIsSorted() as string] ?? (
                        <svg
                          className="ml-2 h-4 w-4 opacity-50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <div>{content}</div>
                  )}

                  {/* Column Filter */}
                  {meta?.filterType && (
                    <ColumnFilter
                      headerContext={header.getContext()}
                      filterType={meta.filterType}
                      filterOptions={meta.filterOptions}
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
