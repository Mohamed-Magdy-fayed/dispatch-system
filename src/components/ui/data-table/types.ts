import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  Table,
  HeaderContext,
  ColumnMeta,
} from "@tanstack/react-table";

// ============================================
// Data Table Types
// ============================================

export type FilterType =
  | "text"
  | "number"
  | "number-range"
  | "date"
  | "date-range"
  | "select";

// Extend ColumnMeta to include filter info
export interface ColumnFilterMeta extends ColumnMeta<any, any> {
  filterType?: FilterType;
  filterOptions?: string[];
}

// Props for column filter component
export interface ColumnFilterProps {
  headerContext: HeaderContext<any, any>;
  filterType?: FilterType;
  filterOptions?: string[];
}

export interface DataTableContextProps<TData> {
  table: Table<TData>;

  // ⭐ NEW
  pageMeta?: PageMeta;
  setPageMeta?: React.Dispatch<React.SetStateAction<PageMeta>>;
}

export interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  children: React.ReactNode;

  // ⭐ NEW
  pageMeta?: PageMeta;
}

export interface DataTableToolbarProps {
  columnKey?: string; // العمود اللي عايزين نعمل له search
}

// ============================================
// Paging Types (Server-side)
// ============================================

export interface PageMeta {
  pageIndex: number; // 0-based
  pageSize: number;
  totalCount: number;
}
