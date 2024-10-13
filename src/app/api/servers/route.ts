import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";

export async function POST(req : NextRequest){
    try {
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()

        if(!profile){
            return NextResponse.json("Error at API/SERVERS/POST :: Profile not found :: UnAuthorized", { status : 401})
        }
    
        const server = await db.server.create({
            data : {
                name,
                image : imageUrl,
                inviteCode : uuidv4(),
                profileId : profile.id,
                members : {
                    create : [
                        {
                            profileId : profile.id,
                            role : MemberRole.ADMIN
                        }
                    ]
                },
                channels : {
                    create : [
                        {
                            profileId : profile.id,
                            name : "general",
                        }
                    ]
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("Error at API/SERVERS/POST", error)
        return NextResponse.json("Internal Error", { status : 500})
    }
}