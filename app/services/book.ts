'use server'

import { BookOverviewResponse, Response, SearchParams } from "@/lib/interface"
import { getQueryParameters } from "@/lib/query";

export const getBookOverview = async(searchParams?: SearchParams, auto=false):Promise<BookOverviewResponse>=>{
    try {
        const params = getQueryParameters(searchParams, auto);
        // const res = await fetch(`${process.env.BACKEND_URL}/books?${params.toString()}`);
        // const data =  await res.json();
        return { data:null, count: 1, status:true, code:200, message:"Successful" };
    } catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!", data:null, count:0 }
    }
}

export const createBook = async(body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/books`, { method:"POST", body });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const updateBook = async(id:string, body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/books/${id}`, { method:"PUT", body });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const deleteBook = async(id:string):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/books/${id}`, { method:"DELETE" });
        return await res.json();
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}