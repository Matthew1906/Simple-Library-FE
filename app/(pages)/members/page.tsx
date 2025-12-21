import { getMemberOverview } from "@/app/services/member";
import { DataTable } from "@/app/ui";
import { SearchParams } from "@/lib/interface";
import { Metadata } from "next";
import { columns, CreateMemberButton } from "./ui";

export const metadata: Metadata = { title: "Library Member Overview" };

export default async function MemberOverview({ searchParams } : { searchParams?: SearchParams }) {
    const params = await searchParams;
    const members = await getMemberOverview(params, true)
    return <div className="space-y-4">
        <p className="text-2xl font-semibold text-gradient-wave">Member Overview</p>
        <DataTable
            columns={columns}
            data={members.data ?? []}
            actionHandlers={[ <CreateMemberButton key={0} /> ]}
            count={members.count}
            filters={[ { key: "name", type: "search", label: "member" } ]}
        />
    </div>
}
