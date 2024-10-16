"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"

import React, { useState } from "react";  
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";


export const InviteModal = () => {
    const {onOpen, isOpen, onClose, type, data } = useModal()
    const origin = useOrigin()
    const {server} = data
    const inviteLink = `${origin}/invite/${server?.inviteCode}`
    const isModalOpen = isOpen && type === "invite"

    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)

    const onCopy = () => {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        },1000)
    }

    const onNew = async () => {
        try {
            setLoading(true)
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite", {server : response.data.updatedInviteCode})
            setLoading(false)
        } catch (error) {
            console.log("Error at invite-modal",error)
            setLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black">
                <div>
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-extrabold">Invite People</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <Label className="font-semibold text-zinc-600">Server Invite Link</Label>
                    </div>
                    <div className="flex flex-row overflow-hidden">
                        <Input className="bg-zinc-300/50 text-black border-0 focus-visible:ring-0 mt-1" value={inviteLink} />
                        <Button size="icon" onClick={onCopy} disabled={loading}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4"/>}                      
                        </Button>
                    </div>
                    <Button variant="link" size="sm" className="text-black mt-2 " onClick={onNew} disabled={loading}>
                        Generate New Link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
  );
}