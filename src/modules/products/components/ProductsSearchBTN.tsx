"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";

interface ProductsSearchBTNProps {
  onSearch?: () => void;
}

export function ProductsSearchBTN({ onSearch }: ProductsSearchBTNProps) {
  return (
    <Button variant={"secondary"} onClick={onSearch} disabled={!onSearch}>
      Search
    </Button>
  );
}
