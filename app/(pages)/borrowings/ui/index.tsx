'use client'

import dynamic from "next/dynamic";
import columns from "./columns";
import NewBorrowingButton from "./actions";
import { DataTableProps } from "@/app/ui/server-table";
import { BookBorrowing, Book, Member } from "@/lib/interface";
import ReturnBorrowingButton from "./selections";

const DataTable = dynamic<DataTableProps<BookBorrowing, unknown>>(() => import("@/app/ui/server-table"), { ssr: false });

const BorrowingTable = (
    { data, count, members, books } : 
    { data: BookBorrowing[], count:number, members: Member[], books: Book[] }
)=>{
    return <DataTable
        columns={columns}
        data={data}
        actionHandlers={[ 
            <NewBorrowingButton key={0} members={members} books={books}/> 
        ]}
        count={count}
        filters={[ 
            { key: "book.title+member.name", type: "search", label: "book title/member" },
            { key:  "borrowDate", type:"daterange", label:"borrow date"},
        ]}
        isSelectionControls
        rowSelectionHandlers={[ 
            <ReturnBorrowingButton key={0} />
        ]}
    />
}

export default BorrowingTable