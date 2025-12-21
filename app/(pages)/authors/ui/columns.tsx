'use client'

import { PopupContainer, ProceedAlert } from "@/app/ui"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Author } from "@/lib/interface"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { EllipsisVertical } from "lucide-react"
import AuthorForm from "./form"
import { deleteAuthor } from "@/app/services/author"

const columns: ColumnDef<Author>[] = [
    { 
        accessorKey:"name",
        header:"Author Name",
        enableSorting: true 
    },
    { 
        header:"Actions",
        cell:({ row }: CellContext<Author, unknown>)=>{
            return <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical className="w-4 h-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                           <PopupContainer
                                trigger={<p className="column-action">Edit</p>}
                                modalTitle="Edit author data"
                                modalDescription="Type down the author name"
                            >
                                <AuthorForm canUpdate id={row.original.id} data={row.original} />
                            </PopupContainer>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <ProceedAlert
                                action={()=>deleteAuthor(row.original.id)}
                                success="Successfully deleted this author and all related data!"
                                warning={`You are about to delete all records related to this author (${row.original.name})`}
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