'use client'

import z from "zod";
import { Member } from "@/lib/interface"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMember, updateMember } from "@/app/services/member";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RequiredAsterisk } from "@/app/ui";
import ClientDataTable from "@/app/ui/client-table";
import columns from "./borrowing";

const schema = z.object({
    code: z.string().min(5).max(5),
    name: z.string().min(3).max(100),
    email: z.string().nullish().transform(val => val === "" ? null : val).pipe(z.email().nullish()),
    phone_no: z.string().nullish().transform(val => val === "" ? null : val).pipe(z.string().nullish()),
})

const MemberForm = (
    { id, data, closeDialog, canUpdate } : 
    { id?:string, data?: Member|null, closeDialog?:()=>void, canUpdate?:boolean } 
) =>{

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues:{ 
            name: data?.name ?? "",
            code: data?.code ?? "",
            email: data?.email ?? undefined,
            phone_no: data?.phone_no ?? undefined
        }
    });  
    
    const onSubmit = (values:z.infer<typeof schema>)=>{
        const body = new FormData();
        for(const key of Object.keys(values)){
            const val = values[key as keyof typeof values]
            if(val) body.set(key, val.toString())        
        }
        form.clearErrors();
        if(id) {
            updateMember(id, body).then((res)=>{
                if(res?.status){
                    closeDialog?.();
                    toast.success("Successfully updated member data")
                } else {
                    toast.warning(res.message)
                    form.reset();         
                }
            })
        } else {
            createMember(body).then((res)=>{
                if(res?.status){
                    closeDialog?.();
                    toast.success("Successfully added a new member data")
                } else {
                    toast.warning(res.message)
                    form.reset();         
                }
            })
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col rounded-md space-y-4 py-4">
            <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Member Code <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <Input placeholder="Insert member code" {...field} disabled={!canUpdate} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Full Name <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <Input placeholder="Insert member full name" {...field} disabled={!canUpdate} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Insert member email" {...field} value={field.value??""} type="email" disabled={!canUpdate} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phone_no"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone No</FormLabel>
                        <FormControl>
                            <Input placeholder="Insert member phone number" {...field} value={field.value??""} type="tel" disabled={!canUpdate} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            { data && !canUpdate && 
                <div className="my-2 space-y-4">
                    <p className="text-sm md:text-base font-semibold"> Member Borrowings</p>
                    <ClientDataTable data={data.borrowings} columns={columns} />
                </div>
            }
            { canUpdate &&
                <div className="flex justify-end gap-2 my-4 px-2 sm:px-0">
                    <Button type="button" variant="destructive" onClick={closeDialog}>Cancel</Button>
                    <Button>Save</Button>
                </div>
            }
        </form>
    </Form>
                        
}

export default MemberForm;