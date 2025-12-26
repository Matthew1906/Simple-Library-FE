import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronLastIcon, ChevronFirstIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  readonly table: Table<TData>;
  readonly count: number;
  readonly isClient?: boolean
}

/** Pagination bar component to move between pages */
export default function PaginationBar<TData>({ table, count, isClient }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-wrap items-center justify-between p-3 rounded-b-lg border-t border-[--border-color]">
      { !isClient && 
        <div className="flex-1 text-sm text-muted-foreground">
          {`${table.getRowCount()} out of ${count} rows found`}
        </div>
      }
      <div className="flex flex-wrap items-center space-x-6 lg:space-x-8">
        <div className="flex flex-wrap items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-17.5 cursor-pointer">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="cursor-pointer">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">To first page</span>
            <ChevronFirstIcon className="h-4 w-4 cursor-pointer" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">To previous page</span>
            <ChevronLeftIcon className="h-4 w-4 cursor-pointer" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">To next page</span>
            <ChevronRightIcon className="h-4 w-4 cursor-pointer" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">To last page</span>
            <ChevronLastIcon className="h-4 w-4 cursor-pointer" />
          </Button>
        </div>
      </div>
    </div>
  );
}
