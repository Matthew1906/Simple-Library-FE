
import AuthorTable from "./ui";
import { getAuthorOverview } from "@/app/services/author";
import { SearchParams } from "@/lib/interface";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Author Overview" };

export default async function AuthorOverview({ searchParams } : { searchParams?: SearchParams }) {
    const params = await searchParams;
    const authors = await getAuthorOverview(params, true)
    return <div className="space-y-4">
        <p className="text-lg lg:text-2xl font-semibold">Author Overview</p>
        <AuthorTable data={authors.data??[]} count={authors.count} />
    </div>
}
