import type { ColumnDef, Table, HeaderContext, ColumnMeta } from "@tanstack/react-table";

/* ============================================
   UI Filter Types (رسم الفلتر فقط)
============================================ */
export type FilterType =
  | "text"
  | "number"
  | "number-range"
  | "date"
  | "date-range"
  | "select"
  | "select-multiple";

/* ============================================
   Column Meta (UI hint فقط)
============================================ */
// بنستخدمه عشان نعرف نرسم input مناسب
// مش له علاقة بالفلترة الفعلية
export interface ColumnFilterMeta extends ColumnMeta<any, any> {
  filterType?: FilterType;
  filterOptions?: string[];
}

/* ============================================
   Column Filter Component Props
============================================ */
export interface ColumnFilterProps {
  headerContext: HeaderContext<any, any>;
  filterType?: FilterType;
  filterOptions?: string[];
}

/* ============================================
   Server-side Filter Value
============================================ */
export type TableFilterValue =
  | string
  | number
  | string[]
  | { from?: number; to?: number }
  | { from?: Date; to?: Date };

/* ============================================
   Server-side Filters Object
============================================ */
export type TableFilters = Record<string, TableFilterValue | undefined>;

/* ============================================
   Server-side Sorting
============================================ */
export interface TableSort {
  field: string;
  direction: "asc" | "desc";
}

/* ============================================
   Server-side Pagination Meta
============================================ */
export interface PageMeta {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

/* ============================================
   Table Query State
============================================ */
export interface TableQueryState {
  filters: TableFilters;
  sort?: TableSort;
  pageIndex: number;
  pageSize: number;
}

/* ============================================
   DataTable Context
============================================ */
export interface DataTableContextProps<TData> {
  table: Table<TData>;
  pageMeta?: PageMeta;
  queryState?: TableQueryState;
  setQueryState?: React.Dispatch<React.SetStateAction<TableQueryState>>;
}

/* ============================================
   DataTable Props
============================================ */
export interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  children: React.ReactNode;
  pageMeta?: PageMeta;
  queryState?: TableQueryState;
  setQueryState?: React.Dispatch<React.SetStateAction<TableQueryState>>;
}

/* ============================================
   Toolbar Props
============================================ */
export interface DataTableToolbarProps {
  columnKey?: string;
}
