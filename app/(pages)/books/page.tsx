import { getBookOverview } from "@/app/services/book";
import { DataTable } from "@/app/ui";
import { SearchParams } from "@/lib/interface";
import { Metadata } from "next";
import { columns, CreateBookButton } from "./ui";

export const metadata: Metadata = { title: "Book Overview" };

export default async function BookOverview({ searchParams } : { searchParams?: SearchParams }) {
    const params = await searchParams;
    const books = await getBookOverview(params, true)
    return <div className="space-y-4">
        <p className="text-2xl font-semibold text-gradient-wave">Book Overview</p>
        <DataTable
            columns={columns}
            data={books.data ?? []}
            actionHandlers={[ <CreateBookButton key={0} /> ]}
            count={books.count}
            filters={[ { key: "title+author.name", type: "search", label: "book" } ]}
        />
    </div>
}
