"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog"

import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";  
import axios from "axios"
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChannelType } from "@prisma/client";
import qs from "query-string"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required",
    }).refine(
        name => name !== "general",
        {
            message : "Channel Name Cannot be general"
        }
    ),
    type : z.nativeEnum(ChannelType)
})


export const CreateChannelModal = () => {
    const { isOpen, onClose, type } = useModal()
    const router = useRouter()
    const params = useParams()

    const isModalOpen = isOpen && type === "createChannel"
    
    const form = useForm({
        resolver : zodResolver(formSchema),
        defaultValues : {
            name : "",
            type : ChannelType.TEXT
        }
    })

    const isLoading = form.formState.isSubmitting
    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url : `/api/channels`,
                query : { serverId : params.serverId}
            })
            const response = await axios.post(url, values)

            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log("Error at initial-server-modal",error)
        }
        
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-extrabold">Create A Channel</DialogTitle>
                    <DialogDescription className="text-center font-semibold text-zinc-600">Give your Channel a Name and a Type.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                        <FormField 
                            control={form.control}
                            name = "name"
                            render = {({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-600 font-semibold text p-2">
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}    
                                            placeholder="Enter Channel Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>Channel Type</FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>                                        
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select A Channel Type" />
                                            </SelectTrigger>
                                         </FormControl>
                                         <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="TEXT">Text</SelectItem>
                                                <SelectItem value="AUDIO">Audio</SelectItem>
                                                <SelectItem value="VIDEO">Video</SelectItem>
                                            </SelectGroup>
                                         </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        
                        
                        />
                        </div>
                        <DialogFooter>
                            <Button disabled={isLoading} variant="primary" className="mt-4">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
  );
}