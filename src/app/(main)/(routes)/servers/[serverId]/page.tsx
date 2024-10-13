const ServerIdPage = ({params} : {params : {serverId : string}}) => {
    return ( 
        <div>
            {typeof params}
            ServerPage : ${params.serverId}
        </div>
     );
}
 
export default ServerIdPage;