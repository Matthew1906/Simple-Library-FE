'use client'

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { returnBookBorrowings } from "@/app/services/borrowing";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DateInput, RequiredAsterisk } from "@/app/ui";

const schema = z.object({
    return_date: z.date().transform((d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))),
})

const ReturnForm = (
    { borrowings, closeDialog } : 
    { borrowings:string[], closeDialog?:()=>void } 
) =>{
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });  

    const onSubmit = (values:z.infer<typeof schema>)=>{
        const body = new FormData();
        for(const borrowId of borrowings){
            body.append("borrowings", borrowId);
        }
        body.set("return_date", values.return_date.toString())
        form.clearErrors();
        returnBookBorrowings(body).then((res)=>{
            if(res?.status){
                closeDialog?.();
                toast.success("Successfully return selected books!")
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
                name="return_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">Return Date <RequiredAsterisk /></FormLabel>
                        <FormControl>
                            <DateInput date={field.value} setDate={field.onChange}/>
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

export default ReturnForm;