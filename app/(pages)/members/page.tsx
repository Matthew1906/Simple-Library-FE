import MemberTable from "./ui";
import { getMemberOverview } from "@/app/services/member";
import { SearchParams } from "@/lib/interface";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Library Member Overview" };

export default async function MemberOverview({ searchParams } : { searchParams?: SearchParams }) {
    const params = await searchParams;
    const members = await getMemberOverview(params, true)
    return <div className="space-y-4">
        <p className="text-lg lg:text-2xl font-semibold">Member Overview</p>
        <MemberTable count={members.count} data={members.data??[]} />
    </div>
}
