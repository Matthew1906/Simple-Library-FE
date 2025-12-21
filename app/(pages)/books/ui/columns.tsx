'use client'

import BookForm from "./form"
import { PopupContainer, ProceedAlert } from "@/app/ui"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Book } from "@/lib/interface"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { EllipsisVertical } from "lucide-react"
import { deleteBook } from "@/app/services/book"
import { Badge } from "@/components/ui/badge"
import { capitalizeString } from "@/lib/string"

const columns: ColumnDef<Book>[] = [
    { 
        accessorKey:"title",
        header:"Book Title",
        enableSorting: true 
    },
    {
        accessorKey:"author.name",
        id:"author-name",
        header:"Author",
        enableSorting:true
    },
    { 
        accessorKey:"type",
        header:"Category",
        enableSorting:true,
        cell:({ row })=>{
            return <Badge className={`${row.original.type === 'NON_FICTION' ? "bg-blue-800" : "bg-amber-800" } text-white`} >
                {capitalizeString(row.original.type,"_")}
            </Badge>
        }
    },
    { 
        accessorKey:"publishing_year",
        header:"Year of Publishing",
        enableSorting:true
    },
    { 
        header:"Actions",
        cell:({ row }: CellContext<Book, unknown>)=>{
            return <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical className="w-4 h-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                           <PopupContainer
                                trigger={<p className="column-action">View</p>}
                                modalTitle="View book data"
                                modalDescription="View book details"
                            >
                                <BookForm id={row.original.id} data={row.original} />
                            </PopupContainer>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <PopupContainer
                                trigger={<p className="column-action">Edit</p>}
                                modalTitle="Edit book data"
                                modalDescription="Edit book details"
                            >
                                <BookForm canUpdate id={row.original.id} data={row.original} />
                            </PopupContainer>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <ProceedAlert
                                action={()=>deleteBook(row.original.id)}
                                success="Successfully deleted this book and all related data!"
                                warning={`You are about to delete all records related to this book (${row.original.title})`}
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