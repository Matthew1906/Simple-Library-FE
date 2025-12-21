'use client'

import z from "zod";
import { Author } from "@/lib/interface"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAuthor, updateAuthor } from "@/app/services/author";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RequiredAsterisk } from "@/app/ui";

const schema = z.object({
    name: z.string().min(3)
})

const AuthorForm = (
    { id, data, closeDialog, canUpdate } : 
    { id?:string, data?: Author|null, closeDialog?:()=>void, canUpdate?:boolean } 
) =>{

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues:{ name: data?.name ?? "" }
    });  
    
    const onSubmit = (values:z.infer<typeof schema>)=>{
        const body = new FormData();
        for(const val of Object.keys(values)){
            body.set(val, values[val as keyof typeof values])
        }
        form.clearErrors();
        if(id) {
            updateAuthor(id, body).then((res)=>{
                if(res?.status){
                    closeDialog?.();
                    toast.success("Successfully updated author name")
                } else {
                    toast.warning("Unexpected error occurred!")
                    form.reset();         
                }
            })
        } else {
            createAuthor(body).then((res)=>{
                if(res?.status){
                    closeDialog?.();
                    toast.success("Successfully added a new author")
                } else {
                    toast.warning("Unexpected error occurred!")
                    form.reset();         
                }
            })
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col rounded-md space-y-4 py-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Author Name <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <Input placeholder="Insert author name" {...field} disabled={!canUpdate} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex justify-end gap-2 my-4 px-2 sm:px-0">
                <Button type="button" variant="destructive" onClick={closeDialog}>Cancel</Button>
                { canUpdate && <Button>Save</Button> }
            </div>
        </form>
    </Form>
                        
}

export default AuthorForm;