'use client'

import z from "zod";
import { Book } from "@/lib/interface"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBook, updateBook } from "@/app/services/book";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ComboBoxSelect, RequiredAsterisk } from "@/app/ui";

const schema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(200).nullish(),
    type: z.enum(['FICTION', 'NON_FICTION']),
    author_id: z.string(),
    publishing_year: z.string(),
})

const BookForm = (
    { id, data, closeDialog, canUpdate } : 
    { id?:string, data?: Book|null, closeDialog?:()=>void, canUpdate?:boolean } 
) =>{

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues:{ 
            title: data?.title ?? "",
            description: data?.description,
            type: data?.type ?? "FICTION",
            author_id: data?.author_id,
            publishing_year: data?.publishing_year ?? new Date().getFullYear().toString(),
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
            updateBook(id, body).then((res)=>{
                if(res?.status){
                    closeDialog?.();
                    toast.success("Successfully updated book data")
                } else {
                    toast.warning("Unexpected error occurred!")
                    form.reset();         
                }
            })
        } else {
            createBook(body).then((res)=>{
                if(res?.status){
                    closeDialog?.();
                    toast.success("Successfully added a new book data")
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
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Book Title <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <Input placeholder="Insert book title" {...field} disabled={!canUpdate} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea 
                                placeholder="Insert book description" 
                                {...field} rows={4}
                                value={field.value??undefined}  
                                disabled={!canUpdate} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Book Type <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <ComboBoxSelect 
                                label="book type"
                                onChange={field.onChange}
                                value={field.value}
                                placeholder="Select book type"
                                disabled={!canUpdate}
                                options={[ 
                                    { key:"FICTION", value:"Fiction" }, 
                                    { key:"NON_FICTION", value:"Non Fiction" }
                                ]}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="author_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Author <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <ComboBoxSelect 
                                label="author"
                                onChange={field.onChange}
                                value={field.value}
                                placeholder="Select author"
                                disabled={!canUpdate}
                                options={[]}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="publishing_year"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Publishing Year <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <ComboBoxSelect 
                                label="publishing year"
                                onChange={field.onChange}
                                value={field.value}
                                placeholder="Select publishing year"
                                disabled={!canUpdate}
                                options={ Array.from(
                                    { length: new Date().getFullYear() - 1800 + 1 }, 
                                    (_, i) => new Date().getFullYear() - i).map(
                                        val=>({ key:val.toString(), value:val.toString() })
                                    )
                                }
                            />
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

export default BookForm;