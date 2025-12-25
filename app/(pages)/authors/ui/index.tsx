'use client'

import dynamic from "next/dynamic";
import columns from "./columns";
import CreateAuthorButton from "./actions";
import { DataTableProps } from "@/app/ui/data-table";
import { Author } from "@/lib/interface";

const DataTable = dynamic<DataTableProps<Author, unknown>>(() => import("@/app/ui/data-table"), { ssr: false });

const AuthorTable = ({ data, count } : { data: Author[], count:number })=>{
    return <DataTable
        columns={columns}
        data={data}
        actionHandlers={[ <CreateAuthorButton key={0} /> ]}
        count={count}
        filters={[ { key: "name", type: "search", label: "name" } ]}
    />
}

export default AuthorTable