'use client'

import MemberForm from "./form"
import { PopupContainer, ProceedAlert } from "@/app/ui"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Member } from "@/lib/interface"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { EllipsisVertical } from "lucide-react"
import { deleteMember } from "@/app/services/member"

const columns: ColumnDef<Member>[] = [
    { 
        accessorKey:"code",
        header:"Member Code",
        enableSorting: true 
    },
    {
        accessorKey:"name",
        header:"Full name",
        enableSorting:true
    },
    { 
        header:"Actions",
        cell:({ row }: CellContext<Member, unknown>)=>{
            return <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical className="w-4 h-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                           <PopupContainer
                                trigger={<p className="column-action">View</p>}
                                modalTitle="View member"
                                modalDescription="View member details"
                            >
                                <MemberForm id={row.original.id} data={row.original} />
                            </PopupContainer>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <PopupContainer
                                trigger={<p className="column-action">Edit</p>}
                                modalTitle="Edit member"
                                modalDescription="Update member details"
                            >
                                <MemberForm canUpdate id={row.original.id} data={row.original} />
                            </PopupContainer>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <ProceedAlert
                                action={()=>deleteMember(row.original.id)}
                                success="Successfully deleted this member and all related data!"
                                warning={`You are about to delete all records related to this member (${row.original.code} - ${row.original.name})`}
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