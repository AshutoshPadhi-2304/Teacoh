"use client"

import { useEffect, useState } from "react"
import { CreateServerModal } from "../modals/create-server-modal"
import { InviteModal } from "../modals/invite-modal"
import { EditServer } from "../modals/edit-server"
import { ManageMembersModal } from "../modals/manage-members"
import { CreateChannelModal } from "../modals/create-channel-modal"
import { LeaveServerModal } from "../modals/leave-server-modal"
import { DeleteServerModal } from "../modals/delete-server-modal"

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
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
        </div>
    )
}