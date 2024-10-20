import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, Shield, University, Video } from "lucide-react";


interface ServerSidebarProps {
    serverId : string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic  className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4"/>,

}

const roleIconMap = {
    [MemberRole.ADMIN] : <Shield className="mr-2 h-4 w-4" />, 
    [MemberRole.TEACHER] : <University className="mr-2 h-4 w-4" />,
    [MemberRole.STUDENT] : null
}

const ServerSidebar = async({serverId} : ServerSidebarProps) => {
    const profile = await currentProfile()
    if(!profile){
        return redirect("/")
    }

    // Get the server and all the channels and members here 
    const server = await db.server.findUnique({
        where : {
            id : serverId,
            members : {
                some : {
                    profileId : profile.id
                }
            }
        },
        include : {
            channels : {
                orderBy : {
                    createdAt : "asc"
                }
            },
            members : {
                include : {
                    profile : true
                },
                orderBy : {
                    role : "asc"
                }
            }
        }
    })

    // Get all the different types of channels in the server and all the members
    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)

    if(!server){
        return redirect("/")
    }
    const members = server?.members

    // Our Role so we can show the right options
    const role = server?.members.find((member) => member.profileId === profile.id)?.role;
    return (  
        <div className="flex flex-col h-full text-primary w-full bg-[#1b1a1a]">
            <ServerHeader 
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <ServerSearch data = {[
                    {
                        label : "Text Channels",
                        type : "channel",
                        data : textChannels?.map((channel) => ({
                            icon : iconMap[channel.type],
                            name : channel.name,
                            id : channel.id,
                        })) || []
                    },
                    {
                        label : "Voice Channels",
                        type : "channel",
                        data : audioChannels?.map((channel) => ({
                            icon : iconMap[channel.type],
                            name : channel.name,
                            id : channel.id,
                        })) || []
                    },
                    {
                        label : "Video Channels",
                        type : "channel",
                        data : videoChannels?.map((channel) => ({
                            icon : iconMap[channel.type],
                            name : channel.name,
                            id : channel.id,
                        })) || []
                    },
                    {
                        label : "Members",
                        type : "member",
                        data : members?.map((member) => ({
                            icon : roleIconMap[member.role],
                            name : member.profile.name,
                            id : member.id,
                        })) || []
                    }
                ]} 
                />
            </ScrollArea>
        </div>
     );
}
 
export default ServerSidebar;