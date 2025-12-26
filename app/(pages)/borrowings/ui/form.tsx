'use client'

import z from "zod";
import { BookBorrowing } from "@/lib/interface"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { returnBookBorrowings } from "@/app/services/borrowing";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DateInput, RequiredAsterisk } from "@/app/ui";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const schema = z.object({
    member: z.string(),
    book: z.string(),
    borrow_date: z.date().transform((d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))),
    due_date: z.date().transform((d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))),
    return_date: z.date().transform((d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))),
})

const BorrowingForm = (
    { id, data, closeDialog, canUpdate=false } : 
    { id:string, data: BookBorrowing, closeDialog?:()=>void, canUpdate?:boolean } 
) =>{
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues:{
            book: data.book.title,
            member: data.member.name,
            borrow_date:  new Date(data.borrow_date),
            due_date: new Date(data.due_date),
            return_date: data.return_date ? new Date(data.return_date) : undefined
        }
    });  

    // eslint-disable-next-line react-hooks/incompatible-library
    const [ dueDate ] = form.watch([ 'due_date' ]);

    const isBookDue = useMemo(()=>{
        if(dueDate){
            const due = new Date(dueDate);
            return due < new Date();
        } 
        return false;
    }, [ dueDate ])
    
    const onSubmit = (values:z.infer<typeof schema>)=>{
        const body = new FormData();
        body.append("borrowings", id);
        body.set("return_date", values.return_date.toString())
        form.clearErrors();
        returnBookBorrowings(body).then((res)=>{
            if(res?.status){
                closeDialog?.();
                toast.success("Successfully return this book!")
            } else {
                toast.warning(res.message)
                form.reset();         
            }
        }) 
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col rounded-md space-y-4 py-4">
            <FormField
                control={form.control}
                name="member"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Member <RequiredAsterisk /></FormLabel>
                        <FormControl>
                           <Input value={field.value} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="book"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Book Title <RequiredAsterisk /></FormLabel>
                        <FormControl>
                           <Input value={field.value} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="borrow_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Borrow Date <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <DateInput date={field.value} setDate={field.onChange} disabled />
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
                            <DateInput date={field.value} setDate={field.onChange} disabled/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            { isBookDue && 
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Overdue Book Returns</AlertTitle>
                    <AlertDescription>
                        This book is past its due date and must be returned immediately!
                    </AlertDescription>
                </Alert>
            }
            <FormField
                control={form.control}
                name="return_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Return Date <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <DateInput date={field.value} setDate={field.onChange} disabled={!canUpdate}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            { canUpdate && 
                <div className="flex justify-end gap-2 my-4 px-2 sm:px-0">
                    <Button type="button" variant="destructive" onClick={closeDialog}>Cancel</Button>
                    <Button>Save</Button>
                </div>
            }
        </form>
    </Form>
                        
}

export default BorrowingForm;