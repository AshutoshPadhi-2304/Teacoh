import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"

export async function PATCH (req : NextRequest, {params} : {params : {serverId :string}}){
    try {
        const profile = await currentProfile()
        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const server = await db.server.update({
            where : {
                id : params.serverId,
                profileId : {
                    not : profile.id
                },
                members : {
                    some : {
                        profileId : profile.id
                    },
                }
            },
            data : {
                members : {
                    deleteMany : {
                        profileId : profile.id
                    },
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("Error at API/SERVERS/SERVERID/LEAVE/PATCH", error)
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}