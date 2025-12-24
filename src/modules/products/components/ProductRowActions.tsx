"use client";

import * as React from "react";
import { DataTableRowActions } from "@/components/ui/data-table";
import { deleteProduct } from "../actions/product.actions";

interface Props {
  row: any;
}

export function ProductRowActions({ row }: Props) {
  const product = row.original;

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      await deleteProduct(product.id);
      // The page will be revalidated by the action
      window.location.reload();
    }
  };

  return (
    <DataTableRowActions
      row={row}
      actions={[
        {
          label: "Edit",
          onClick: () => console.log("Edit", product),
        },
        {
          label: "Delete",
          onClick: handleDelete,
          variant: "destructive",
        },
        {
          label: "New Action",
          onClick: handleDelete,
          variant: "destructive",
        },
      ]}
    />
  );
}
