'use server'

import { AuthorOverviewResponse, Response, SearchParams } from "@/lib/interface"
import { getQueryParameters } from "@/lib/query";
import { revalidateTag } from "next/cache";

export const getAuthorOverview = async(searchParams?: SearchParams, auto=false):Promise<AuthorOverviewResponse>=>{
    try {
        const params = getQueryParameters(searchParams, auto);
        const res = await fetch(`${process.env.BACKEND_URL}/authors?${params.toString()}`, { next:{ tags:['authors']}});
        const data =  await res.json();
        return data;
    } catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!", data:null, count:0 }
    }
}

export const createAuthor = async(body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/authors`, { method:"POST", body });
        const result = await res.json();
        revalidateTag("authors", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const updateAuthor = async(id:string, body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/authors/${id}`, { method:"PUT", body });
        const result = await res.json();
        revalidateTag("authors", "max")
        revalidateTag("books", "max");
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const deleteAuthor = async(id:string):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/authors/${id}`, { method:"DELETE" });
        const result = await res.json();
        revalidateTag("authors", "max")
        revalidateTag("books", "max");
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}