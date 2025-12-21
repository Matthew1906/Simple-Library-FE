/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { EyeIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Children, cloneElement, isValidElement, ReactElement, useCallback, useEffect, useState } from "react";
import { TableFilter } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, RowSelectionState, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { PaginationBar, TableFilterInput, SortHeader } from "./data";

interface DataTableProps<TData, TValue> {
  /** Column definitions */
  readonly columns: ColumnDef<TData, TValue>[];
  /** Data displayed in the table */
  readonly data: TData[];
  /** Total number of data that can be retrieved */
  readonly count: number;
  /** List of filters to be used on this table */
  readonly filters?: TableFilter[];
  /** Indicator if this table has an on-select feature */
  readonly isSelectionControls?: boolean;
  /** List of react components that can execute a function using the selected data as the parameter */
  readonly rowSelectionHandlers?: ReactElement<{ data: TData[] }>[];
  /** Create Button or other actions*/
  readonly actionHandlers?: ReactElement[];
  /** Indicator if this table needs a visibility control */
  readonly isVisibleControls?: boolean;
  /** List of extra properties to be passed to the column and table */
  readonly extraProps?: Record<
    string, string | object | Array<object> | Array<string> | boolean | null
  >;
}

export default function DataTable<TData, TValue>(
  { 
    columns, data, count, filters,
    isSelectionControls = false,
    rowSelectionHandlers,
    actionHandlers,
    isVisibleControls = false,
    extraProps = {},
  } : DataTableProps<TData, TValue>
) {
  
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams()
  const [ pagination, setPagination ] = useState({ pageIndex: Number(searchParams.get("page")??"1")-1, pageSize: Number(searchParams.get("numPages")??"10") });
  const [ sorting, setSorting ] = useState<SortingState>(
    (searchParams.get("sort") && searchParams.get("sort")?.split("-").length === 2)
      ? [{ id: searchParams.get("sort")?.split("-")[0], desc:searchParams.get("sort")?.split("-")[1] === 'desc' } ] as SortingState 
      : []
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<TableFilter[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [resetTrigger, setResetTrigger] = useState(false);

  const changeColumnFilters = useCallback(
    (filterVal: TableFilter) => {
      setColumnFilters([
        ...columnFilters.filter((filter) => filter.key !== filterVal.key),
        filterVal,
      ]);
    }, []);

  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const submitFilter = useCallback(() => {
    if (columnFilters.length > 0) {
      setIsFilterChanged(!isFilterChanged);
    }
  }, [ columnFilters, isFilterChanged ]);

  const resetFilter = useCallback(() => {
    setColumnFilters([]);
    setResetTrigger(!resetTrigger);
    setIsFilterChanged(!isFilterChanged);
  }, [ columnFilters, isFilterChanged, resetTrigger ])

  useEffect(()=>{
    const newParams = new URLSearchParams();
    // Pagination
    newParams.set("page", (pagination.pageIndex + 1).toString());
    newParams.set("numPages", pagination.pageSize.toString());
    // Sorting
    if (sorting?.length >= 1) {
      const sortItem = sorting[0];
      if (sortItem) {
        newParams.set("sort", `${sortItem.id}-${sortItem.desc ? "desc" : "asc"}`)
      }
    } else if(sorting.length === 0) {
      newParams.delete("sort");
    }
    // Filters
    columnFilters.forEach((filter) => {
      if (!!filter.value && Array.isArray(filter.value)) {
        newParams.append(
          "filter",
          `${filter.key}+${filter.type}+${filter.value.join("+")}`
        );
      } else if (!!filter.value && filter.type != "search") {
        newParams.append(
          "filter",
          `${filter.key}+${filter.type}+${filter.value}`
        );
      } else if (!!filter.value && filter.type === "search") {
        newParams.append(
          "filter",
          `${filter.value}+${filter.type}+${filter.key}`
        );
      }
    });
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [ pagination, sorting, isFilterChanged ])

  // Table hook
  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: Math.ceil(count / pagination.pageSize),
    manualSorting: true,
    onSortingChange: setSorting,
    manualFiltering: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { pagination, sorting, columnVisibility, rowSelection },
  });
  
  return <div className="w-full flex flex-col gap-2">
    <div className="w-full flex gap-2 justify-end">
      {/* Custom action */}
      {actionHandlers?.map((actionHandler) => {
          if (isValidElement(actionHandler)) {
            return cloneElement(actionHandler, { key: actionHandler.key });
          }
        })}
      {/* Custom row selection handler */}
      {isSelectionControls && rowSelectionHandlers && (
        <>
          {rowSelectionHandlers.map(
            (Handler: ReactElement<{ data: TData[] }>) => {
              const rawData = table.getSelectedRowModel();
              const data = rawData.rows.map((row) => row.original);
              const modifiedHandler = Children.map(
                Handler,
                (child) => {
                  if (isValidElement(child)) {
                    return cloneElement(child, { data, key:child.key });
                  }
                  return Handler;
                }
              );
              return modifiedHandler;
            }
          )}
        </>
      )}
    </div>
    {(filters || isVisibleControls || isSelectionControls) && (
      <div className="flex w-full items-end justify-between">
        {/* Filter input */}
        {filters && (
          <>
            <div className="inline-flex flex-wrap gap-2 items-end">
              {(filters ?? []).map((filter) => {
                const colFilter = columnFilters.find(val=>val.key === filter.key);
                return <TableFilterInput
                    filter={colFilter??filter}
                    key={`${filter.key}-${resetTrigger}`}
                    onChange={changeColumnFilters}
                />
                
              })}
              {/* Button filter */}
              <Button onClick={submitFilter} type="button" className="cursor-pointer" variant={"outline"}>Filter</Button>
              <Button onClick={resetFilter} type="button" className="cursor-pointer" variant={"outline"}>Reset</Button>
            </div>

            {isVisibleControls && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.columnDef.header?.toString()}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}
      </div>
    )}
    <div className="flex">
      <div className="flex-1 w-0 rounded-lg border border-[--border-color] overflow-hidden">
        <Table className="rounded-lg">
          <TableHeader className="rounded-xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {isSelectionControls && (
                  <TableHead>
                    <Checkbox
                      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.column.columnDef.enableSorting 
                          ? <SortHeader column={header.column}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </SortHeader>
                          : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group border-b-0 relative after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-[--border-color] duration-0"
                >
                  {isSelectionControls && (
                    <TableCell>
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="duration-0">
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                          ...extraProps,
                        })}
                      </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <PaginationBar table={table} count={count} />
      </div>
    </div>
  </div>
    
}
