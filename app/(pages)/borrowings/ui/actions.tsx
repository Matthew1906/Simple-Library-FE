'use client'

import NewBorrowingForm from "./new";
import { PopupContainer } from "@/app/ui"
import { Button } from "@/components/ui/button"
import { Book, Member } from "@/lib/interface"

const NewBorrowingButton = ({ members, books } : { members: Member[], books: Book[]  })=>{
    return <PopupContainer
        trigger={<Button>Add new borrowings</Button>}
        modalTitle="Add new borrowings"
        modalDescription="Insert borrowing details"
    >
        <NewBorrowingForm members={members} books={books} />
    </PopupContainer>
}

export default NewBorrowingButton