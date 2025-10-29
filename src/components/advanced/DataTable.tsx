"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckLineIcon,
  DownloadIcon,
  EyeIcon,
  EyeCloseIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
} from "@/icons";
import { cn } from "@/lib/utils/cn";

// Base interfaces
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
  exportable?: boolean;
}

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface DataTableProps<T extends TableRow> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
  };
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onExport?: (data: T[], format: "csv" | "json") => void;
  className?: string;
}

export interface SortState {
  column: string;
  direction: "asc" | "desc";
}

export interface FilterState {
  [key: string]: string;
}

/**
 * Advanced Data Table Component
 * Features: sorting, filtering, pagination, column visibility, export, row selection
 */
export const DataTable = <T extends TableRow>({
  data,
  columns,
  title,
  searchable = true,
  exportable = true,
  selectable = true,
  pagination = { enabled: true, pageSize: 10, pageSizeOptions: [5, 10, 20, 50] },
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  onSelectionChange,
  onExport,
  className,
}: DataTableProps<T>) => {
  // State management
  const [sortState, setSortState] = useState<SortState | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [globalSearch, setGlobalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filteredData = [...data];

    // Apply global search
    if (globalSearch) {
      filteredData = filteredData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(globalSearch.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue) {
        filteredData = filteredData.filter((row) =>
          String(row[column]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortState) {
      filteredData.sort((a, b) => {
        const aValue = a[sortState.column];
        const bValue = b[sortState.column];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortState.direction === "asc" ? comparison : -comparison;
      });
    }

    return filteredData;
  }, [data, globalSearch, filters, sortState]);

  // Pagination logic
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination.enabled
    ? processedData.slice(startIndex, endIndex)
    : processedData;

  // Visible columns
  const visibleColumns = columns.filter(column => !hiddenColumns.has(String(column.key)));

  // Handlers
  const handleSort = useCallback((column: keyof T) => {
    setSortState(prev => {
      if (prev?.column === column) {
        return prev.direction === "asc"
          ? { column: String(column), direction: "desc" }
          : null;
      }
      return { column: String(column), direction: "asc" };
    });
  }, []);

  const handleFilterChange = useCallback((column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
    setCurrentPage(1);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  }, [paginatedData, selectedRows.size]);

  const handleRowSelect = useCallback((rowId: string | number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  const handleExport = useCallback((format: "csv" | "json") => {
    const selectedData = selectedRows.size > 0
      ? data.filter(row => selectedRows.has(row.id))
      : processedData;

    onExport?.(selectedData, format);
  }, [data, processedData, selectedRows, onExport]);

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  }, []);

  // Effect for selection change callback
  React.useEffect(() => {
    const selectedData = data.filter(row => selectedRows.has(row.id));
    onSelectionChange?.(selectedData);
  }, [selectedRows, data, onSelectionChange]);

  if (loading) {
    return (
      <div className={cn("bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800", className)}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {processedData.length} total records
              {selectedRows.size > 0 && `, ${selectedRows.size} selected`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Column Visibility Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowColumnVisibility(!showColumnVisibility)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <EyeIcon className="w-5 h-5" />
              </button>

              {showColumnVisibility && (
                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Column Visibility
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {columns.map((column) => (
                      <label key={String(column.key)} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!hiddenColumns.has(String(column.key))}
                          onChange={() => toggleColumnVisibility(String(column.key))}
                          className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {column.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Options */}
            {exportable && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport("csv")}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => handleExport("json")}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  JSON
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {searchable && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search across all columns..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              {selectable && (
                <th className="w-12 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:text-gray-700 dark:hover:text-gray-300",
                    column.width && `w-${column.width}`,
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUpIcon
                          className={cn("w-3 h-3", sortState?.column === column.key && sortState.direction === "asc" ? "text-brand-600" : "text-gray-400")}
                        />
                        <ChevronDownIcon
                          className={cn("w-3 h-3", sortState?.column === column.key && sortState.direction === "desc" ? "text-brand-600" : "text-gray-400")}
                        />
                      </div>
                    )}
                  </div>
                  {column.filterable && (
                    <input
                      type="text"
                      placeholder={`Filter ${column.label}`}
                      value={filters[String(column.key)] || ""}
                      onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors",
                    onRowClick && "cursor-pointer",
                    selectedRows.has(row.id) && "bg-brand-50 dark:bg-brand-900/20"
                  )}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right"
                      )}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] || "")
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.enabled && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {pagination.pageSizeOptions?.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Showing {startIndex + 1} to {Math.min(endIndex, processedData.length)} of {processedData.length} results
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-lg",
                        currentPage === pageNum
                          ? "bg-brand-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage:
// const columns: TableColumn<User>[] = [
//   { key: "name", label: "Name", sortable: true, filterable: true },
//   { key: "email", label: "Email", sortable: true, filterable: true },
//   { key: "role", label: "Role", sortable: true },
//   {
//     key: "status",
//     label: "Status",
//     render: (value) => (
//       <span className={`px-2 py-1 rounded-full text-xs ${
//         value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//       }`}>
//         {value}
//       </span>
//     )
//   }
// ];
//
// <DataTable
//   data={users}
//   columns={columns}
//   title="User Management"
//   onRowClick={(user) => console.log("Selected user:", user)}
//   onSelectionChange={(users) => console.log("Selected users:", users)}
//   onExport={(data, format) => console.log("Export:", format, data)}
// />