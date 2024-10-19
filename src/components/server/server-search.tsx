"use client"

import React, { useState } from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import { Search } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

interface ServerSearchProps {
    data : {
        label : string,
        type : "channel" | "member"
        data : {
            icon : React.ReactNode,
            name : string,
            id : string
        }[] 
    }[]
}

const ServerSearch = ({data} : ServerSearchProps) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const params = useParams()

    const onClickSearchItem = ({id, type} : {id : string, type : "channel" | "member"}) => {
        setOpen(false)

        if(type === "channel"){
            router.push(`/servers/${params.serverId}/channels/${id}`)
        }
        if(type === "member"){
            router.push(`/servers/${params.serverId}/conversations/${id}`)
        }
    }
    const handleClick = () => {
        setOpen(true)
    }   
    return (  
        <div>
            <button onClick={handleClick} className="min-w-full bg-[#1f1f1f] hover:bg-[#000000]"> 
                <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm">Search</span>
                    <span className="text-primary"><Search className="h-4 w-4"/></span>
                </div>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>  
                <CommandList>
                    <CommandInput placeholder="Search" />
                        <CommandEmpty>No Commands Found</CommandEmpty>   
                        {data.map(({label, type, data}) => {
                            if(!data?.length) 
                                return null
                            return(
                                <CommandGroup key ={label} heading={label}>
                                    {data?.map(({icon, id, name}) => {
                                        return(
                                            <CommandItem key={id} onSelect={() => onClickSearchItem({id, type})}>
                                                {icon}
                                                <span>{name}</span>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            )    
                        })}
                    </CommandList>                  
            </CommandDialog>
        </div>
    );
}
 
export default ServerSearch;