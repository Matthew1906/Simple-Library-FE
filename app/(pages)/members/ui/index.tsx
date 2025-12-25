'use client'

import dynamic from "next/dynamic";
import columns from "./columns";
import CreateMemberButton from "./actions";
import { DataTableProps } from "@/app/ui/data-table";
import { Member } from "@/lib/interface";

const DataTable = dynamic<DataTableProps<Member, unknown>>(() => import("@/app/ui/data-table"), { ssr: false });

const MemberTable = ({ data, count } : { data: Member[], count:number })=>{
    return <DataTable
        columns={columns}
        data={data}
        actionHandlers={[ <CreateMemberButton key={0} /> ]}
        count={count}
        filters={[ { key: "name", type: "search", label: "member" } ]}
    />
}

export default MemberTable