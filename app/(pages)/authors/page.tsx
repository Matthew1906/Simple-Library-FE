import { getAuthorOverview } from "@/app/services/author";
import { DataTable } from "@/app/ui";
import { SearchParams } from "@/lib/interface";
import { Metadata } from "next";
import { columns, CreateAuthorButton } from "./ui";

export const metadata: Metadata = { title: "Author Overview" };

export default async function AuthorOverview({ searchParams } : { searchParams?: SearchParams }) {
    const params = await searchParams;
    const authors = await getAuthorOverview(params, true)
    return <div className="space-y-4">
        <p className="text-2xl font-semibold text-gradient-wave">Author Overview</p>
        <DataTable
            columns={columns}
            data={authors.data ?? []}
            actionHandlers={[ <CreateAuthorButton key={0} /> ]}
            count={authors.count}
            filters={[ { key: "name", type: "search", label: "Name" } ]}
        />
    </div>
}
