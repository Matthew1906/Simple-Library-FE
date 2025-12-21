'use client'

import { Children, cloneElement, isValidElement, ReactElement, useCallback, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";


const PopupContainer = (
  { trigger, modalTitle, modalDescription, children } :
  { trigger:ReactElement<{ onClick:()=>void }>, modalTitle:string, modalDescription:string, children: ReactElement<{closeDialog:()=>void}> }
)=>{
    const isDesktop = globalThis.innerWidth>=768;
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const openDialog = useCallback(()=>setIsOpen(true), [setIsOpen]);
    const closeDialog = useCallback(()=>setIsOpen(false), [setIsOpen]);
    const modifiedTrigger = Children.map(trigger, (child)=> {
      if (isValidElement(child)){
        return cloneElement(child, { key: trigger.key, onClick:openDialog })
      }
    })
    const modifiedChildren = Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child, { key:child.key, closeDialog });
      }
      return child;
    });
    return isDesktop 
    ? <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {modifiedTrigger}
        <DialogContent className="min-w-[30vw] max-w-[80vw] max-h-[90vh] w-auto p-6 rounded-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogDescription className="whitespace-pre-line">{modalDescription}</DialogDescription>
          </DialogHeader>
          {modifiedChildren}
        </DialogContent>
      </Dialog>
    : <Drawer open={isOpen} onOpenChange={setIsOpen}>
        {modifiedTrigger}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{modalTitle}</DrawerTitle>
            <DrawerDescription>{modalDescription}</DrawerDescription>
          </DrawerHeader>
          <div className="py-2 px-5">{modifiedChildren}</div>
        </DrawerContent>
      </Drawer>
}

export default PopupContainer;