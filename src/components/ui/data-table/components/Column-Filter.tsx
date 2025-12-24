"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import type { ColumnFilterProps, TableFilterValue } from "../types";
import { useDataTable } from "./data-table-context";

/* ============================================
   Helper function to normalize value
   يحول القيم الفارغة إلى undefined لتقليل casts
============================================ */
function normalizeValue(value: unknown): TableFilterValue | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  return value as TableFilterValue;
}

/* ============================================
   ColumnFilter Component
   يدعم text, number, select, select-multiple
============================================ */
export function ColumnFilter({
  headerContext,
  filterType = "text",
  filterOptions,
}: ColumnFilterProps) {
  const column = headerContext.column;
  const { queryState, setQueryState } = useDataTable();

  if (!queryState || !setQueryState) return null;

  const field = column.id;
  const currentValue = queryState.filters[field];

  const updateFilter = (value?: TableFilterValue) => {
    setQueryState({
      ...queryState,
      filters: {
        ...queryState.filters,
        [field]: normalizeValue(value),
      },
      pageIndex: 0, // أي تغيير فلتر يرجع لأول صفحة
    });
  };

  switch (filterType) {
    case "text":
      return (
        <Input
          placeholder="Search..."
          value={(currentValue as string) ?? ""}
          onChange={(e) => updateFilter(e.target.value)}
          className="mt-1 w-full"
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={(currentValue as number) ?? ""}
          onChange={(e) =>
            updateFilter(e.target.value ? Number(e.target.value) : undefined)
          }
          className="mt-1 w-full"
        />
      );

    case "select":
      return (
        <Select
          value={(currentValue as string) ?? ""}
          onValueChange={(v) => updateFilter(v)}
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

    case "select-multiple":
      return (
        <div className="mt-1 w-full">
          <Combobox
            value={(currentValue as string[]) ?? []}
            onValueChange={(values: string[]) =>
              updateFilter(values.length > 0 ? values : undefined)
            }
            multiple
          >
            <ComboboxChips>
              <ComboboxChipsInput placeholder="Select multiple..." />
            </ComboboxChips>
            <ComboboxContent>
              <ComboboxList>
                {filterOptions?.map((opt) => (
                  <ComboboxItem key={opt} value={opt}>
                    {opt}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      );

    default:
      return null;
  }
}
