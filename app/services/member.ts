'use server'

import { MemberOverviewResponse, Response, SearchParams } from "@/lib/interface"
import { getQueryParameters } from "@/lib/query";
import { revalidateTag } from "next/cache";

export const getMemberOverview = async(searchParams?: SearchParams, auto=false):Promise<MemberOverviewResponse>=>{
    try {
        const params = getQueryParameters(searchParams, auto);
        const res = await fetch(`${process.env.BACKEND_URL}/members?${params.toString()}`, { next:{ tags:['members'] } });
        const data =  await res.json();
        return data;
    } catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!", data:null, count:0 }
    }
}

export const createMember = async(body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/members`, { method:"POST", body });
        const result = await res.json();
        revalidateTag("members", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const updateMember = async(id:string, body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/members/${id}`, { method:"PUT", body });
        const result = await res.json();
        revalidateTag("members", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const deleteMember = async(id:string):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/members/${id}`, { method:"DELETE" });
        const result = await res.json();
        revalidateTag("members", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}