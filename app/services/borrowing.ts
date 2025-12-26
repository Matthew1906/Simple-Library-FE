'use server'

import { BookBorrowingOverviewResponse, Response, SearchParams } from "@/lib/interface"
import { getQueryParameters } from "@/lib/query";
import { revalidateTag } from "next/cache";

export const getBookBorrowingOverview = async(searchParams?: SearchParams, auto=false):Promise<BookBorrowingOverviewResponse>=>{
    try {
        const params = getQueryParameters(searchParams, auto);
        const res = await fetch(`${process.env.BACKEND_URL}/borrowings?${params.toString()}`, { next:{ tags: ['borrowings', 'books', 'members']}});
        const data =  await res.json();
        return data;
    } catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!", data:null, count:0 }
    }
}

export const createBookBorrowings = async(body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/borrowings`, { method:"POST", body });
        const result = await res.json();
        revalidateTag("borrowings", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const returnBookBorrowings = async( body:FormData):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/borrowings`, { method:"PATCH", body });
        const result = await res.json();
        revalidateTag("borrowings", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}

export const deleteBookBorrowing = async(id:string):Promise<Response>=>{
    try{ 
        const res = await fetch(`${process.env.BACKEND_URL}/borrowings/${id}`, { method:"DELETE" });
        const result = await res.json();
        revalidateTag("borrowings", "max")
        return result;
    }catch(error){
        console.log(error);
        return { status:false, code:500, message:"Unexpected error occurred!" }
    }
}