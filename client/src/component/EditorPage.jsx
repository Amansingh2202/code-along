import { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import {useLocation}  from "react-router-dom"
import toast from "react-hot-toast";
import { initSocket} from "../socket";
import { useNavigate, useParams } from "react-router-dom";


const EditorPage = () => {
           
  const[clients,setClient]=useState([])
          const socketRef=useRef(null);
          const codeRef=useRef(null)
          const location =useLocation()
          const {roomId}=useParams();
          const navigate=useNavigate();

             
           
          useEffect(()=>{
            const init=async()=>{
              socketRef.current=await initSocket();
              socketRef.current.on('connect_error',(err)=>handleError(err))
              socketRef.current.on('connect_failed',(err)=>handleError(err))
              const handleError=(e)=>{
                console.log('socket error=>',e)
                toast.error('socket connection failed')
                navigate('/')
              }
              socketRef.current.emit('join',{
                roomId,
                username:location.state?.username||"guest"
              })
               
             socketRef.current.emit("join",{
              roomId,
              username:location.state?.username,
             })
                
             // eslint-disable-next-line no-unused-vars
             socketRef.current.on('joined', ({ clients, username, socketId }) => {
                    if(username!==location.state?.username)
                    {
                      toast.success(`${username} joined`)
                    }
                    setClient(clients) // displaying all clients in the existing room
                     socketRef.current.emit('sync-code',{
                      code:codeRef.current,
                      socketId
                     })
                  });

          
            // if user is disconnected
            socketRef.current.on("disconnected",({socketId,username})=>{
              toast.success(`${username} leave the room`)
              setClient((prev)=>{ // removing the client room the dashborad
                return prev.filter(
                  (client)=> client.socketId !=socketId 
                )
              })
            })
                       


            }
            init()

            return ()=>{
              socketRef.current.disconnect();
              socketRef.current.off('joined');
              socketRef.current.off('disconnected');
            }
          },[roomId,location.state])
       
        
       // eslint-disable-next-line no-unused-vars
      


      if(!location.state)
      {
        return navigate('/')
      }
         
       const copyRoomId=async()=>{
        try{
                             await navigator.clipboard.writeText(roomId);
                             toast.success("Room id is copied")
        }
        catch(err){
          toast.error("unable to copy room id")
        }
       }
       const leaveRoom=()=>{
        navigate("/")
       }

   



  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-2 bg-dark text-light d-flex flex-column h-100" style={{ boxShadow: "2px 0px 4px rgba(0,0,0.1)" }}>
          <h1 className="p-4 text-info" style={{ marginLeft: "7px" }}>Code-along</h1>
          <hr style={{ marginTop: "1rem" }} />
          
          {/* Client list container */}
          <div className="d-flex  flex-column overflow-auto ">
              {
                clients.map((client)=>(
                  <Client key={client.socketId} username={client.username}/>
                ))
              }

          </div>

          {/* Buttons at the bottom */}
       
          <div className="mb-5 mt-auto d-flex flex-column ">
          <hr/>
            <button onClick={copyRoomId} className="btn btn-success mb-2">Copy Room Id</button>
            <button onClick={leaveRoom}className="  btn btn-danger px-3 btn-block">Leave Room</button>
          </div>
        </div>

        {/* Editor */}
        <div className="col-md-10 text-light d-flex flex-column hh-100">
          <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
             codeRef.current=code 
          }}/>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
