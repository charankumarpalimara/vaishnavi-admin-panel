"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from "lucide-react";
import { Pagination, PaginationProps } from "./Pagination";

export type SortDirection = "asc" | "desc";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T, index: number) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  // Optional integrated pagination
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
  };
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries to display at this moment.",
  emptyIcon,
  emptyAction,
  pagination,
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (column: ColumnDef<T>) => {
    if (!column.sortable) return;

    if (sortKey === column.key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(column.key);
      setSortDirection("asc");
    }
  };

  // Sorted data (if sorting is active)
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    const column = columns.find((c) => c.key === sortKey);
    if (!column) return data;

    return [...data].sort((a, b) => {
      let valA: any = column.sortValue ? column.sortValue(a) : (a as any)[sortKey];
      let valB: any = column.sortValue ? column.sortValue(b) : (b as any)[sortKey];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection, columns]);

  // Paginated slice (if client-side pagination is handled internally and totalItems matches data.length)
  const displayedData = useMemo(() => {
    if (!pagination) return sortedData;

    // If parent handles slicing, data is already sliced
    if (pagination.totalItems !== sortedData.length) {
      return sortedData;
    }

    const start = (pagination.currentPage - 1) * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination]);

  return (
    <div
      className={`bg-white rounded-md border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col ${className}`}
    >
      {/* Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs sm:text-sm font-normal border-collapse">
          {/* Header */}
          <thead className="bg-stone-50/90 text-stone-600 border-b border-stone-200 text-xs sm:text-sm">
            <tr>
              {columns.map((column) => {
                const isSorted = sortKey === column.key;
                const alignClass =
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                    ? "text-right"
                    : "text-left";

                return (
                  <th
                    key={column.key}
                    scope="col"
                    style={{ width: column.width }}
                    onClick={() => handleSort(column)}
                    className={`py-3.5 px-4 font-medium transition-colors select-none ${alignClass} ${
                      column.sortable
                        ? "cursor-pointer hover:bg-stone-100/70 hover:text-stone-900"
                        : ""
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        column.align === "right"
                          ? "justify-end flex-row-reverse"
                          : column.align === "center"
                          ? "justify-center"
                          : "justify-start"
                      }`}
                    >
                      <span>{column.header}</span>
                      {column.sortable && (
                        <span className="text-stone-400">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[#581c3c]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-[#581c3c]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-stone-100 bg-white">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skeleton-${rIdx}`} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={`skeleton-col-${cIdx}`} className="py-4 px-4">
                      <div className="h-4 bg-stone-100 rounded-sm w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayedData.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-14 px-4 text-center text-stone-500 font-normal"
                >
                  <div className="max-w-xs mx-auto space-y-2">
                    <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                      {emptyIcon || <Inbox className="w-6 h-6" />}
                    </div>
                    <div className="text-sm sm:text-base font-medium text-stone-800">
                      {emptyTitle}
                    </div>
                    <p className="text-xs text-stone-500 font-normal">
                      {emptyDescription}
                    </p>
                    {emptyAction && <div className="pt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              displayedData.map((item, rowIdx) => {
                const key = keyExtractor(item, rowIdx);
                const isClickable = Boolean(onRowClick);

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      isClickable
                        ? "cursor-pointer hover:bg-stone-50"
                        : "hover:bg-stone-50/60"
                    }`}
                  >
                    {columns.map((column) => {
                      const alignClass =
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : "text-left";

                      return (
                        <td
                          key={`${key}-${column.key}`}
                          className={`py-3.5 px-4 text-stone-700 align-middle ${alignClass}`}
                        >
                          {column.render
                            ? column.render(item, rowIdx)
                            : (item as any)[column.key]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Embedded Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions}
          showPageSizeSelector={pagination.showPageSizeSelector}
        />
      )}
    </div>
  );
}

export default DataTable;

