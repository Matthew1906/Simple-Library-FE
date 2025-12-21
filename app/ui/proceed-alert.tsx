"use client";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Response } from "@/lib/interface";
import { ReactNode } from "react";
import { toast } from "sonner";

const ProceedAlert = (
    { children, action, warning, success } : 
    { children: ReactNode; action: () => Promise<Response>; warning: string; success: string; }
) => {
  const router = useRouter();
  return <AlertDialog>
      <AlertDialogTrigger asChild={typeof children !== 'string'} className="hover:cursor-pointer hover:bg-accent px-2 py-1.5 rounded-sm w-full flex justify-start text-sm">
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>{warning}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              action()
                .then((res: Response) => {
                  if (res.status) {
                    toast.success(success);
                    router.refresh();
                  } else {
                    toast.error(res.message);
                  }
                })
                .catch((error) => {
                  toast.error(error);
                });
            }}
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
};


export default ProceedAlert;
