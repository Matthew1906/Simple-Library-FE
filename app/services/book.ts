'use server'

import { BookOverviewResponse, Response, SearchParams } from "@/lib/interface"
import { getQueryParameters } from "@/lib/query";
import { revalidateTag } from "next/cache";

export const getBookOverview = async(searchParams?: SearchParams, auto=false):Promise<BookOverviewResponse>=>{
    try {
        const params = getQueryParameters(searchParams, auto);
        const res = await fetch(`${process.env.BACKEND_URL}/books?${params.toString()}`, { next:{ tags:['books']}});
        const data =  await res.json();
        return data;
    } catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!", data:null, count:0 }
    }
}

export const createBook = async(body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/books`, { method:"POST", body });
        const result = await res.json();
        revalidateTag("books", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const updateBook = async(id:string, body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/books/${id}`, { method:"PUT", body });
        const result = await res.json();
        revalidateTag("books", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const deleteBook = async(id:string):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/books/${id}`, { method:"DELETE" });
        const result = await res.json();
        revalidateTag("books", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}