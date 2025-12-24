"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Action {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface DataTableRowActionsProps {
  row: any;
  actions?: Action[];
}

/* ============================================
   Row Actions (Dropdown Menu)
============================================ */
export function DataTableRowActions({
  row,
  actions,
}: DataTableRowActionsProps) {
  if (actions?.length) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              className={action.variant === "destructive" ? "text-red-600" : ""}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Fallback
  return (
    <div>
      <button onClick={() => console.log("Edit", row.original)}>Edit</button>
      <button onClick={() => console.log("Delete", row.original)}>
        Delete
      </button>
    </div>
  );
}
