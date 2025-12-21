'use client'

import { PopupContainer } from "@/app/ui"
import { Button } from "@/components/ui/button"
import AuthorForm from "./form"

const CreateAuthorButton = ()=>{
    return <PopupContainer
        trigger={<Button>Create Author</Button>}
        modalTitle="Add new author"
        modalDescription="Type down the author name"
    >
        <AuthorForm canUpdate />
    </PopupContainer>
}

export default CreateAuthorButton