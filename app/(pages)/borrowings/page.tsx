
import BorrowingTable from "./ui";
import { getMemberOverview } from "@/app/services/member";
import { SearchParams } from "@/lib/interface";
import { Metadata } from "next";
import { getBookBorrowingOverview } from "@/app/services/borrowing";
import { getBookOverview } from "@/app/services/book";

export const metadata: Metadata = { title: "Book Borrowing Overview" };

export default async function BookOverview({ searchParams } : { searchParams?: SearchParams }) {
    const params = await searchParams;
    const memberData = getMemberOverview();
    const bookData = getBookOverview();
    const borrowingData = getBookBorrowingOverview(params, true);
    const [ books, borrowings, members ] = await Promise.all([ bookData, borrowingData, memberData ]);
    return <div className="space-y-4">
        <p className="text-lg lg:text-2xl font-semibold">Book Borrowing Overview</p>
        <BorrowingTable 
          data={borrowings.data??[]} count={borrowings.count} 
          members={members.data??[]} books={books.data??[]} 
        />
    </div>
}
