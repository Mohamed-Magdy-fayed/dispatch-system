"use client";

import * as React from "react";
import { DataTableRowActions } from "@/components/ui/data-table";

interface Props {
  row: any;
}

export function ProductRowActions({ row }: Props) {
  return <DataTableRowActions row={row} />;
}
