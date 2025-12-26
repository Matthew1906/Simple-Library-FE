"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback, useState } from "react";
import { PaginationBar, TableFilterInput, SortHeader } from "./data";
import { TableFilter } from "@/lib/interface";

interface DataTableProps<TData, TValue> {
  /** Column definitions */
  readonly columns: ColumnDef<TData, TValue>[];
  /** Data displayed in the table */
  readonly data: TData[];
  /** List of filters to be used on this table */
  readonly filters?: TableFilter[];
}

/**
 * Renders a data table with functionalities that is executed on the client side
 *
 * @component
 * @example
 * // Usage example:
 *  <ClientDataTable data={notification.data.queues} columns={columns} isSelectionControls={notification.canFlush} rowSelectionHandlers={[ notification.canFlush ? ( <FlushQueuesButton key={1} id={notification.data.id} />) : (<></>),]} extraProps={{ id: notification.data.id, canSend: notification.canSend,}}/>
 *
 * @param {ColumnDef} props.columns - column definitions
 * @param {ReactElement} props.data - data displayed in the table
 * @param {TableFilter} props.filters - list of filters to be used on this table
 * @param {boolean} props.isSelectionControls - indicator if this table has an on-select feature
 * @param {ReactElement} props.rowSelectionHandlers - list of react components that can execute a function using the selected data as the parameter
 * @param {boolean} props.isVisibleControls - indicator if this table needs a visibility control
 * @param {ReactElement} props.actionHandlers - action inside the table
 * @param {Record} props.extraProps - list of extra properties to be passed to the column and table
 * @returns {JSX.Element} The rendered ClientDataTable component.
 * */
export default function ClientDataTable<TData, TValue>({
  columns,
  data,
  filters,
}: DataTableProps<TData, TValue>) {
  // Manageable states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // React table configuration
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { sorting,  columnFilters },
  });
  // Filter management function
  const changeColumnFilters = useCallback(
    (filterVal: TableFilter) => {
      table.getColumn(filterVal.key)?.setFilterValue(filterVal.value);
    },
    [table]
  );
  return (
    <div className="flex flex-col gap-2">
      {filters && (
        <div className="flex w-full items-end justify-between">
          {" "}
          {filters && (
            <div className="inline-flex flex-wrap gap-2 items-end">
              {(filters ?? []).map((filter) => (
                <TableFilterInput filter={filter} key={filter.key} onChange={changeColumnFilters} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex">
        <div className="flex-1 w-0 rounded-lg border border-[--border-color] overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return <TableHead key={header.id}>
                      {header.isPlaceholder ? null :
                        header.column.columnDef.enableSorting ?
                          <SortHeader column={header.column}>{flexRender(header.column.columnDef.header, header.getContext())}</SortHeader>
                          : flexRender(header.column.columnDef.header, header.getContext())
                      }
                    </TableHead>
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
                    {row.getVisibleCells().map((cell) => 
                        <TableCell key={cell.id} className="duration-0">
                            {flexRender(cell.column.columnDef.cell, {
                                ...cell.getContext(),
                            })}
                        </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <PaginationBar table={table} count={data.length} isClient />
        </div>
      </div>
    </div>
  );
}
