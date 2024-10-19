import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req : NextRequest, {params} : {params : {serverId : string}}) {
    try {
        const profile = await currentProfile()
        if(!profile){
            return NextResponse.json("Unauthorised Access", {status : 401})
        }
    
        if(!params.serverId){
            return redirect("/")
        }
        const {name, imageUrl} = await req.json()
        const updateServer = await db.server.update({
            where : {
                id : params.serverId,
            },
            data : {
                name,
                image : imageUrl
            }
        })
    
        return NextResponse.json(updateServer)
    } catch (error) {
        console.log("Error at API/SERVERS/SERVERID/PATCH", error)
        return NextResponse.json("Internal Server Error", { status: 500 })       
    }
}

export async function DELETE(req : NextRequest, {params} : {params : {serverId : string}}) {
    try {
        const profile = await currentProfile()
        if(!profile){
            return NextResponse.json("Unauthorised Access", {status : 401})
        }

        const server = await db.server.delete({
            where : {
                id : params.serverId,
                profileId : profile.id
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("Error at API/SERVERS/SERVERID/DELETE", error)
        return NextResponse.json("Internal Server Error", { status: 500 })   
    }
}