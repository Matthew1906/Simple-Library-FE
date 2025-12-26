'use client'

import { BookBorrowing } from "@/lib/interface"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns"

const columns: ColumnDef<BookBorrowing>[] = [
    { 
        accessorKey:"book.title",
        id:"book_title",
        header:"Book Title",
        enableSorting: true 
    },
    { 
        accessorKey:"borrow_date",
        id:"borrowDate",
        header:"Borrow Date",
        enableSorting:true,
        cell:( { row })=>{
            return format(new Date(row.original.borrow_date), "PPP")
        }
    },
    { 
        header:"Status",
        accessorFn:(obj)=>{
            const return_date = obj.return_date;
            const due_date = new Date(obj.due_date);
            return return_date ? "Returned" : due_date < new Date() ? "Overdue" : "Borrowed" 
        },
        cell:({ row })=>{
            const return_date = row.original.return_date;
            const due_date = new Date(row.original.due_date);
            return <Badge className={`${return_date ? "bg-blue-800" : due_date < new Date() ? "bg-amber-800" : "bg-green-800" } text-white`} >
                {return_date ? "Returned" : due_date < new Date() ? "Overdue" : "Borrowed" }
            </Badge>
        }
    }
]

export default columns;