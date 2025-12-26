'use client'

import BorrowingForm from "./form"
import { PopupContainer, ProceedAlert } from "@/app/ui"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookBorrowing } from "@/lib/interface"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { EllipsisVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns"
import { deleteBookBorrowing } from "@/app/services/borrowing"

const columns: ColumnDef<BookBorrowing>[] = [
    {
        accessorKey:"member.name",
        id:"member_name",
        header:"Member",
        enableSorting:true
    },
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
        cell:({ row })=>{
            const return_date = row.original.return_date;
            const due_date = new Date(row.original.due_date);
            return <Badge className={`${return_date ? "bg-blue-800" : due_date < new Date() ? "bg-amber-800" : "bg-green-800" } text-white`} >
                {return_date ? "Returned" : due_date < new Date() ? "Overdue" : "Borrowed" }
            </Badge>
        }
    },
    { 
        header:"Actions",
        cell:({ row }: CellContext<BookBorrowing, unknown>)=>{
            return <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical className="w-4 h-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                           <PopupContainer
                                trigger={<p className="column-action">View</p>}
                                modalTitle="View borrowing data"
                                modalDescription="View borrowing details"
                            >
                                <BorrowingForm id={row.original.id} data={row.original} />
                            </PopupContainer>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <PopupContainer
                                trigger={<p className="column-action">Return</p>}
                                modalTitle="Return book"
                                modalDescription="Fill out the return date to return the book"
                            >
                                <BorrowingForm id={row.original.id} data={row.original} canUpdate />
                            </PopupContainer>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <ProceedAlert
                                action={()=>deleteBookBorrowing(row.original.id)}
                                success="Successfully deleted this borrowing and all related data!"
                                warning={`You are about to delete all records related to this borrowing (${row.original.book.title} to ${row.original.member.name})`}
                            >
                                <p className="column-action">Delete</p>
                            </ProceedAlert>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        }
    }
]

export default columns;