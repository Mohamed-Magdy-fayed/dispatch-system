"use client";

import * as React from "react";

interface ProductsSearchBTNProps {
  onSearch?: () => void;
}

export function ProductsSearchBTN({ onSearch }: ProductsSearchBTNProps) {
  return (
    <button onClick={onSearch} className="btn btn-primary" disabled={!onSearch}>
      Search
    </button>
  );
}
