'use client'

import z from "zod";
import { Member, Book } from "@/lib/interface"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookBorrowings } from "@/app/services/borrowing";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ComboBoxMultiSelect, ComboBoxSelect, DateInput, RequiredAsterisk } from "@/app/ui";
import { useEffect, useState } from "react";

const schema = z.object({
    member_id: z.string(),
    borrow_date: z.date().transform((d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))),
    due_date: z.date().transform((d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())))
})

const NewBorrowingForm = (
    { members, books, closeDialog } : 
    { members: Member[], books: Book[], closeDialog?:()=>void } 
) =>{

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema)
    });  

    const [ selectedBooks, setSelectedBooks ] = useState<string[]>([]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const [ dueDate, borrowDate ] = form.watch([ 'due_date', 'borrow_date' ]);

    useEffect(()=>{
        if(dueDate && borrowDate){
            const due = new Date(dueDate);
            const borrow = new Date(borrowDate);
            if(due < borrow){
                form.setError("due_date", { message:"Due date must be >= borrow date!" });
            }
        }
    }, [ dueDate, borrowDate, form ])
    
    const onSubmit = (values:z.infer<typeof schema>)=>{
        const body = new FormData();
        for(const key of Object.keys(values)){
            const val = values[key as keyof typeof values]
            if(val) body.set(key, val.toString())        
        }
        for(const bookId of selectedBooks){
            body.append("books", bookId)
        }
        form.clearErrors();
        createBookBorrowings(body).then((res)=>{
            if(res?.status){
                closeDialog?.();
                toast.success("Successfully added new borrowings!")
            } else {
                toast.warning(res.message)
            }
        }) 
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col rounded-md space-y-4 py-4">
            <FormField
                control={form.control}
                name="member_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Member <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <ComboBoxSelect 
                                label="member"
                                onChange={field.onChange}
                                value={field.value}
                                placeholder="Select member"
                                options={(members??[]).map(val=>({ key: val.id, value: `${val.code} - ${val.name}`}))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormItem>
                <FormLabel className="flex items-center gap-2">Books <RequiredAsterisk /></FormLabel>
                <ComboBoxMultiSelect 
                    label="book"
                    placeholder="Select book"
                    onChange={setSelectedBooks}
                    value={selectedBooks}
                    options={(books??[]).map(val=>({ key: val.id, value: val.title }))}
                />
                <FormMessage />
            </FormItem>
            <FormField
                control={form.control}
                name="borrow_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Borrow Date <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <DateInput date={field.value} setDate={field.onChange} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Due Date <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <DateInput date={field.value} setDate={field.onChange} possibleFutureYears={3}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex justify-end gap-2 my-4 px-2 sm:px-0">
                <Button type="button" variant="destructive" onClick={closeDialog}>Cancel</Button>
                <Button>Save</Button>
            </div>
        </form>
    </Form>
                        
}

export default NewBorrowingForm;