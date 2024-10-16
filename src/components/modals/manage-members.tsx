"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import React, { useState } from "react";  
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { UserAvatar } from "../userAvatar";
import { ServerWithMembersWithProfiles } from "../../../types";
import { ScrollArea } from "../ui/scroll-area";
import { Check, MoreVertical, Gavel, Loader2 } from "lucide-react";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import qs from "query-string"

export const ManageMembersModal = () => {
    const {onOpen, isOpen, onClose, type, data } = useModal()
    const { server } = data as { server: ServerWithMembersWithProfiles };
    const isModalOpen = isOpen && type === "manageMembers"
    const router = useRouter()

    const [loadingId, setLoadingId] = useState("")

    const onRoleChange = async (id : string , role : MemberRole) => {
        try {
            setLoadingId(id)
            const url = qs.stringifyUrl({
                url : `/api/members/${id}`,
                query : { server : server?.id}
            })
            const response = await axios.patch(url, {role : role})
            router.refresh()
            onOpen("manageMembers", { server: response.data });
            setLoadingId("")
        } catch (error) {
            console.log("Error at manage-members-modal",error)
            setLoadingId("")
        }

        
    }
    const onKick = async (id : string) => {
        try {
            setLoadingId(id)
            const url = qs.stringifyUrl({
                url : `/api/members/${id}`,
                query : { server : server?.id}
            })
            const response = await axios.delete(url)
            router.refresh()
            onOpen("manageMembers", { server: response.data });
        } catch (error) {
            console.log("Error at manage-members-modal",error)
        }
        
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black">
                <div>
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-extrabold">Manage Members</DialogTitle>
                        <DialogDescription className="text-center text-zinc-600">Manage Status of Members In Your Server</DialogDescription>
                    </DialogHeader>
                    <div className="p-2 mt-4">
                        <ScrollArea  className="mt-3 max-h-[300px] pr-6">
                            {server?.members?.map((member) => (
                                <div key={member?.id} className="flex items-center gap-x-2 mb-6" >
                                    <div>
                                        <UserAvatar src={member.profile?.imageUrl} />
                                    </div>
                                    <div className="flex flex-col gap-y-1" >
                                        <div className="text-sm font-semibold flex flew-row items-center gap-x-1 ">
                                            {member.profile?.name}
                                            <div className="ml-3">{member.role}</div>
                                        </div>
                                    </div>
                                    {server.profileId !== member.profile.id && loadingId !== member.id && (
                                        <div className="ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="w-5 h-5 text-zinc-500" /> 
                                                    <DropdownMenuContent>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger className="flex items-center">
                                                                <span>Role</span>
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            onRoleChange(member?.id, "STUDENT")
                                                                        }
                                                                    >
                                                                        Student
                                                                        {member.role === "STUDENT" && (
                                                                        <Check className="w-4 h-4 ml-auto" />
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            onRoleChange(member?.id, "TEACHER")
                                                                        }
                                                                    >
                                                                        Moderator
                                                                        {member.role === "TEACHER" && (
                                                                        <Check className="w-4 h-4 ml-auto" />
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            onRoleChange(member?.id, "ADMIN")
                                                                        }
                                                                    >
                                                                        Admin   
                                                                        {member.role === "ADMIN" && (
                                                                        <Check className="w-4 h-4 ml-auto" />
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => onKick(member?.id)}
                                                            >
                                                            <Gavel className="w-4 h-4 mr-2 text-rose-700" />
                                                            <p className="text-rose-700 font-semibold">Kick</p>
                                                            </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenuTrigger>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                    {loadingId === member.id && (
                                        <Loader2 className="animate-spin text-zonc-500 ml-auto w-4 h-4" />
                                    )}
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                    
                </div>
            </DialogContent>
        </Dialog>
  );
}