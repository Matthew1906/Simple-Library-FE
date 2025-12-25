'use client'

import { PopupContainer } from "@/app/ui"
import { Button } from "@/components/ui/button"
import BookForm from "./form"
import { Author } from "@/lib/interface"

const CreateBookButton = ({ authors } : { authors: Author[] })=>{
    return <PopupContainer
        trigger={<Button>Create Book</Button>}
        modalTitle="Add new book"
        modalDescription="Insert book details"
    >
        <BookForm canUpdate authors={authors} />
    </PopupContainer>
}

export default CreateBookButton