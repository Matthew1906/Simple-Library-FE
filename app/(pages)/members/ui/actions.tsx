'use client'

import { PopupContainer } from "@/app/ui"
import { Button } from "@/components/ui/button"
import MemberForm from "./form"

const CreateMemberButton = ()=>{
    return <PopupContainer
        trigger={<Button>Create Member</Button>}
        modalTitle="Add new member"
        modalDescription="Insert member details"
    >
        <MemberForm canUpdate />
    </PopupContainer>
}

export default CreateMemberButton