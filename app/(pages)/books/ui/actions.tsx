'use client'

import { PopupContainer } from "@/app/ui"
import { Button } from "@/components/ui/button"
import BookForm from "./form"

const CreateBookButton = ()=>{
    return <PopupContainer
        trigger={<Button>Create Book</Button>}
        modalTitle="Add new book"
        modalDescription="Insert book details"
    >
        <BookForm canUpdate />
    </PopupContainer>
}

export default CreateBookButton