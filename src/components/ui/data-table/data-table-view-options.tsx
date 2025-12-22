"use client";

import * as React from "react";
import { useDataTable } from "./data-table-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function DataTableViewOptions() {
  const { table } = useDataTable();

  const columns = table.getAllColumns().filter((col) => col.getCanHide());

  return (
    <DropdownMenu>
      {/* زر فتح القايمة */}
      <DropdownMenuTrigger className="px-3 py-2 border rounded">
        Columns
      </DropdownMenuTrigger>

      {/* محتوى القايمة */}
      <DropdownMenuContent>
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>

        {/* مجموعة العناصر */}
        <DropdownMenuGroup>
          {columns.map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id} // مفتاح فريد لكل عنصر
              checked={col.getIsVisible()} // حالة الظهور
              onCheckedChange={(checked) => col.toggleVisibility(!!checked)} // تبديل الظهور عند الاختيار
              onSelect={(e) => e.preventDefault()} // منع إغلاق القائمة عند الاختيار
            >
              {col.id} {/* اسم العمود */}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
