import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialServerModal } from "@/components/modals/initial-server-modal";

const SetupPage = async () => {
    const profile = await initialProfile();

    if(!profile){
        console.log("Error :: Setup Page :: Profile not found");
    }

    const server = await db.server.findFirst({
        where :{
            members : {
                some : {
                    profileId : profile.id
                }
            }
        }
    })

    if(server){
        redirect(`/servers/${server.id}`)
    }


    return ( 
        <div>
            <InitialServerModal />
        </div>
    );
}
 
export default SetupPage;