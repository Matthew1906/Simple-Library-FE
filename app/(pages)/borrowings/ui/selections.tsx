'use client'

import ReturnForm from "./return";
import { PopupContainer } from "@/app/ui"
import { Button } from "@/components/ui/button"
import { BookBorrowing } from "@/lib/interface";

const ReturnBorrowingButton = ({ data } : { data?: BookBorrowing[]  })=>{
    return <PopupContainer
        trigger={<Button>Return book(s)</Button>}
        modalTitle="Return book(s)"
        modalDescription="Insert return date"
    >
        <ReturnForm borrowings={(data??[]).map(val=>val.id)} />
    </PopupContainer>
}

export default ReturnBorrowingButton;