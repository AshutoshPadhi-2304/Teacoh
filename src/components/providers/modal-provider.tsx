"use client"

import { useEffect, useState } from "react"
import { CreateServerModal } from "../modals/create-server-modal"
import { InviteModal } from "../modals/invite-modal"
import { EditServer } from "../modals/edit-server"
import { ManageMembersModal } from "../modals/manage-members"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted){
        return null
    }
    return (
        <div>
            <CreateServerModal />
            <InviteModal />
            <EditServer />
            <ManageMembersModal />
        </div>
    )
}