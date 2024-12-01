import React, { useState, useEffect } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  isSortable?: boolean;
}

interface TableWithControlsProps<T> {
  columns: Column<T>[];
  fetchData: (params: {
    page: number;
    pageSize: number;
    search: string;
    sortBy: keyof T | null;
    sortOrder: "asc" | "desc" | null;
  }) => Promise<{ data: T[]; totalPages: number }>;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  onRowAction?: (item: T) => React.ReactNode;
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const TableWithControls = <T,>({
  columns,
  fetchData,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  onRowAction,
}: TableWithControlsProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = debounce((searchValue: string) => {
    setSearch(searchValue);
    setPage(1); // Reset to the first page when searching
  }, 500);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: fetchedData, totalPages } = await fetchData({
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      });
      setData(fetchedData);
      setTotalPages(totalPages);
    } catch (error) {
      setError("Error fetching table data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, search, sortBy, sortOrder]);

  const handleSort = (column: Column<T>) => {
    if (!column.isSortable) return;
    const newSortOrder =
      sortBy === column.accessor && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column.accessor as keyof T);
    setSortOrder(newSortOrder);
  };

  // Memoized column header for performance optimization
  const MemoizedColumn = React.memo(({ column }: { column: Column<T> }) => (
    <th
      className={`px-6 py-4 ${column.isSortable ? "cursor-pointer" : ""}`}
      onClick={() => handleSort(column)}
      aria-sort={sortBy === column.accessor
        ? sortOrder === "asc"
          ? "ascending"
          : "descending"
        : "none"}
    >
      {column.header}
      {column.isSortable &&
        sortBy === column.accessor &&
        (sortOrder === "asc" ? " ↑" : " ↓")}
    </th>
  ));

  return (
    <div>
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
          <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
            <tr>
              {columns.map((column, index) => (
                <MemoizedColumn key={index} column={column} />
              ))}
              {onRowAction && (
                <th scope="col" className="px-6 py-4">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-neutral-200 dark:border-white/10"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="whitespace-nowrap px-6 py-4 font-medium"
                  >
                    {typeof column.accessor === "function"
                      ? column.accessor(item)
                      : (item[column.accessor] as React.ReactNode)}
                  </td>
                ))}
                {onRowAction && (
                  <td className="whitespace-nowrap px-6 py-4">
                    {onRowAction(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mr-2"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="ml-2"
          >
            Next
          </button>
        </div>
        <div>
          <label>
            Items per page:
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TableWithControls;
