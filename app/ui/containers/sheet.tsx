'use client'

import { Children, cloneElement, isValidElement, ReactElement, useCallback, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/**
 * A container to create a sheet that opens on-click
 *
 * @component
 * @example
 * @param {Object} props - Props object for the component.
 * @param {ReactElement} props.trigger - a React component that will open the dialog, it must contain on optional onClick function prop
 * @param {string} props.modalTitle - title of the modal
 * @param {string} props.modalDescription - description displayed under the title
 * @param {ReactElement} props.children - content of the modal, it must contain an optional closeDialog function prop
 * @returns {JSX.Element} The rendered PopupContainer component.
 */
const SheetContainer = (
  { trigger, modalTitle, modalDescription, children } :
  { trigger:ReactElement<{ onClick:(e:MouseEvent)=>void }>, modalTitle:string, modalDescription:string, children: ReactElement<{closeDialog:()=>void}> }
)=>{
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const openDialog = useCallback(()=>setIsOpen(true), [setIsOpen]);
    const closeDialog = useCallback(()=>setIsOpen(false), [setIsOpen]);
    const modifiedTrigger = Children.map(trigger, (child)=> {
      if (isValidElement(child)){
        return cloneElement(child, { key:child.key, onClick:(e:MouseEvent)=>{
          e.preventDefault()
          openDialog()
        } })
      }
    })
    const modifiedChildren = Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child, { key:child.key, closeDialog });
      }
      return child;
    });
    return <Sheet open={isOpen} onOpenChange={setIsOpen} >
        {modifiedTrigger}
        <SheetContent className="min-w-150 w-auto sm:max-w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{modalTitle}</SheetTitle>
            <SheetDescription>{modalDescription}</SheetDescription>
          </SheetHeader>
          <div className="py-2 px-5">{modifiedChildren}</div>
        </SheetContent>
    </Sheet>
}

export default SheetContainer;