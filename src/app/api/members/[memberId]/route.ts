import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH (req : NextRequest, {params} : {params : {memberId : string}}){
    try {
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const {searchParams} = new URL(req.url)
        const {role} = await req.json()
        const serverId = searchParams.get("server")
        if(!serverId){
            return new NextResponse("Server not found", { status: 404 })
        }
        if(!role){
            return new NextResponse("Role not found", { status: 404 })
        }

        const member = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id
            },
            data : {
                members : {
                    update : {
                        where : {
                            id : params.memberId,
                            profileId : {
                                not : profile.id    
                            }
                        },
                        data : {
                            role
                        }
                    }
                }
            },
            include : {
                members : {
                    include : {
                        profile : true
                    },
                    orderBy : {
                        role : "asc"
                    }
                },
            }

        })

        return NextResponse.json(member)
    } catch (error) {
        console.log("Error at API/MEMBERS/MEMBERID/PATCH", error)
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(req : NextRequest, {params} : {params : {memberId : string}}){
    try {
        const profile = await currentProfile()
        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("server")

        if(!serverId){
            return new NextResponse("Server not found", { status: 404 })
        }

        if (!params.memberId)
            return new NextResponse("Member Id missing", { status: 400 });

        const member = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id
            },
            data : {
                members : {
                    delete : {
                        id : params.memberId,
                        profileId : {
                            not : profile.id
                        }
                    }
                }
            },
            include : {
                members : {
                    include : {
                        profile : true
                    },
                    orderBy : {
                        role : "asc"
                    },
                }
            }
        })

        return NextResponse.json(member)
    } catch (error) {
        console.log("Error at API/MEMBERS/MEMBERID/DELETE", error)
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}