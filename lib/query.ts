import { SearchParams } from "./interface";

export const getQueryParameters = (searchParams?:SearchParams, auto:boolean=false):URLSearchParams=>{
    const newParams = new URLSearchParams();
    if(searchParams){
        if(searchParams?.page || auto) newParams.set("page", searchParams?.page?.toString()??"1");
        if(searchParams?.numPages || auto) newParams.set("numPages", searchParams?.numPages?.toString()??"10");    
        if(searchParams?.sort){
            newParams.set("sort", searchParams.sort.toString());
        } 
        if(searchParams.filter){
            if(typeof searchParams.filter === 'string'){
                newParams.append("filter", searchParams.filter)
            } else {
                (searchParams.filter??[]).forEach(filter=>{
                    if(filter) newParams.append('filter', filter)
                })
            }
        }
    }
    return newParams;
}