import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req : NextRequest){
    try {
        const profile = await currentProfile()
        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });   
        }
    
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")
        if(!serverId){
            return new NextResponse("Server not found", { status: 404 });
        }
        const {name, type} = await req.json()
        if(!name){
            return new NextResponse("Name not found", { status: 404 });
        }
        if(name === "general"){
            return new NextResponse("Name cannot be general", { status: 400 })
        }
        const server = await db.server.update({
            where : {
                id : serverId,
                members : {
                    some : {
                        profileId : profile.id,
                        role : {
                            in : ["ADMIN", "TEACHER"]
                        }
                    }
                }
            },
            data : {
                channels : {
                    create : {
                        profileId : profile.id,
                        name,
                        type
                    }
                }
            }
        })
    
        return NextResponse.json(server)
    } catch (error) {
        console.log("Error at API/CHANNELS/POST", error)
        return NextResponse.json("Internal Server Error", { status: 500 })   
    }
}