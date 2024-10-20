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
import React, { useEffect, useState } from "react";  
import axios from "axios"
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required",
    }),
    imageUrl : z.string().min(0, {
        message : "Server image is required"
    })
})


export const InitialServerModal = () => {
    const[isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    },[])
    const router = useRouter()
    const form = useForm({
        resolver : zodResolver(formSchema),
        defaultValues : {
            name : "",
            imageUrl : ""
        }
    })

    const isLoading = form.formState.isSubmitting
    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            values.imageUrl = "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"

            const response = await axios.post("/api/servers", values)

            form.reset()
            router.refresh()
            window.location.reload()
        } catch (error) {
            console.log("Error at initial-server-modal",error)
        }
        
    }

    if(!isMounted){
        return null
    }
    return (
        <Dialog open>
            <DialogContent className="bg-white text-black">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-extrabold">Customize Your Server</DialogTitle>
                    <DialogDescription className="text-center font-semibold text-zinc-600">Give your server a Name and a Avatar. You can change it later.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <div className="flex justify-center items-center">
                                Image UPLOAD
                            </div>
                        <FormField 
                            control={form.control}
                            name = "name"
                            render = {({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-600 font-semibold text p-2">
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}    
                                            placeholder="Enter Server Name"
                                            {...field}
                                        />
                                    </FormControl>
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