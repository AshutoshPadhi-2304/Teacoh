import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
export async function PATCH(req : NextRequest, {params} : {params : {serverId : string}}){
    try {
        const profile = await currentProfile()
        if(!profile){
            return NextResponse.json("Unauthorised Access", {status : 401})
        }
        if(!params.serverId){
            return NextResponse.json("Server ID not found", {status : 400})
        }
        const updatedInviteCode = await db.server.update({
            where : {
                id : params?.serverId,
                profileId : profile.id
            },
            data : {
                inviteCode : uuidv4()
            }
        })
        return NextResponse.json({updatedInviteCode}, { status: 200 })
    } catch (error) {
        console.log("Error at API/SERVERS/SERVERID/PATCH", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
} 