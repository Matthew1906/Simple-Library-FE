"use client";

import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface SortHeaderProps<TData, TValue> {
  readonly column: Column<TData, TValue>;
  readonly children: ReactNode;
}

export default function SortHeader<TData, TValue>({ column, children } : SortHeaderProps<TData, TValue>){
  const changeOrder = () => {
    switch (column.getIsSorted()) {
      case "asc":
        column.toggleSorting(true);
        break;
      case "desc":
        column.clearSorting();
        break;
      default:
        column.toggleSorting(false);
        break;
    }
  }
  return <div className="px-0 gap-2 flex items-center">
    {children} <Button type="button" variant="ghost" className="w-auto hover:bg-sidebar-accent rounded-md p-1 cursor-pointer ml-auto transition-all" onClick={changeOrder}>
      {column.getIsSorted() === 'asc' ? (
        <ArrowUp />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDown />
      ) : (
        <ArrowUpDown />
      )}
    </Button>
  </div>
};

