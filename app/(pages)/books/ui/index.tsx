'use client'

import dynamic from "next/dynamic";
import columns from "./columns";
import CreateBookButton from "./actions";
import { DataTableProps } from "@/app/ui/server-table";
import { Author, Book } from "@/lib/interface";

const DataTable = dynamic<DataTableProps<Book, unknown>>(() => import("@/app/ui/server-table"), { ssr: false });

const BookTable = ({ data, count, authors } : { data: Book[], count:number, authors:Author[] })=>{
    return <DataTable
        columns={columns}
        data={data}
        actionHandlers={[ <CreateBookButton key={0} authors={authors}/> ]}
        count={count}
        filters={[ 
            { key: "title+author.name", type: "search", label: "book" },
            { key: "type", type:"select", label:"type", options:[ { key:"FICTION", value:"Fiction" }, { key:"NON_FICTION", value:"Non Fiction" }]}
        ]}
        extraProps={{ authors: authors }}
    />
}

export default BookTable