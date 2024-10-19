"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"

import React, { useState } from "react";  
import { useModal } from "@/hooks/use-modal-store";

import { Button } from "../ui/button";

import axios from "axios";
import queryString from "query-string";
import { useRouter } from "next/navigation";


export const DeleteServerModal = () => {
    const {onOpen, isOpen, onClose, type, data } = useModal()
    const {server} = data
    const isModalOpen = isOpen && type === "deleteServer"   
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const onClick = async() => {
        try {
            setLoading(true)
            const response = await axios.delete(`/api/servers/${server?.id}`)
            
            onClose()
            router.refresh()
            router.push("/")
        } catch (error) {
            console.log("Error at leave-server-modal",error)
        }finally{
            setLoading(false)
        }
    }
   
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <div>
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-extrabold mt-2">Delete Server</DialogTitle>
                        <DialogDescription className="text-center text-base text-zinc-600">Are you sure you want to delete
                            <span className="font-bold text-rose-600 text-lg"> {server?.name}</span> server?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="bg-gray-100 px-6 py-4 mt-4">

                    <div className="flex justify-between w-full items-center">
                        <Button size="sm" onClick={onClose} disabled={loading}>
                            Cancel                     
                        </Button>
                        <Button size="sm" onClick={onClick} disabled={loading}>
                            Confirm                     
                        </Button>
                    </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
  );
}