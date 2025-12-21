'use server'

import { MemberOverviewResponse, Response, SearchParams } from "@/lib/interface"
import { getQueryParameters } from "@/lib/query";

export const getMemberOverview = async(searchParams?: SearchParams, auto=false):Promise<MemberOverviewResponse>=>{
    try {
        const params = getQueryParameters(searchParams, auto);
        // const res = await fetch(`${process.env.BACKEND_URL}/members?${params.toString()}`);
        // const data =  await res.json();
        return { data:null, count: 1, status:true, code:200, message:"Successful" };
    } catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!", data:null, count:0 }
    }
}

export const createMember = async(body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/members`, { method:"POST", body });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const updateMember = async(id:string, body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/members/${id}`, { method:"PUT", body });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const deleteMember = async(id:string):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/members/${id}`, { method:"DELETE" });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}