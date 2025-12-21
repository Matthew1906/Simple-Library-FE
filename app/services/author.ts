'use server'

import { AuthorOverviewResponse, Response, SearchParams } from "@/lib/interface"
import { getQueryParameters } from "@/lib/query";

export const getAuthorOverview = async(searchParams?: SearchParams, auto=false):Promise<AuthorOverviewResponse>=>{
    try {
        const params = getQueryParameters(searchParams, auto);
        // const res = await fetch(`${process.env.BACKEND_URL}/authors?${params.toString()}`);
        // const data =  await res.json();
        return { data:null, count: 1, status:true, code:200, message:"Successful" };
    } catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!", data:null, count:0 }
    }
}

export const createAuthor = async(body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/authors`, { method:"POST", body });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const updateAuthor = async(id:string, body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/authors/${id}`, { method:"PUT", body });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const deleteAuthor = async(id:string):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/authors/${id}`, { method:"DELETE" });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}