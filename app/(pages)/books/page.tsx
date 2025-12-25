import BookTable from "./ui";
import { getBookOverview } from "@/app/services/book";
import { SearchParams } from "@/lib/interface";
import { Metadata } from "next";
import { getAuthorOverview } from "@/app/services/author";


export const metadata: Metadata = { title: "Book Overview" };

export default async function BookOverview({ searchParams } : { searchParams?: SearchParams }) {
    const params = await searchParams;
    const authorData = getAuthorOverview();
    const bookData = getBookOverview(params, true)
    const [ authors, books ] = await Promise.all([ authorData, bookData ]);
    return <div className="space-y-4">
        <p className="text-2xl font-semibold">Book Overview</p>
        <BookTable data={books.data??[]} count={books.count} authors={authors.data??[]} />
    </div>
}
