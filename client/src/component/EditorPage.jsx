import { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import {useLocation}  from "react-router-dom"
import toast from "react-hot-toast";
import { initSocket} from "../socket";
import { useNavigate, useParams } from "react-router-dom";


const EditorPage = () => {

          const socketRef=useRef(null);
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
            }
            init()
          },[roomId,location.state])
       
        
       // eslint-disable-next-line no-unused-vars
       const[clients,setClient]=useState([ {
        socketId:1,username:"Aman singh" 
       },
       {
        socketId:2,username:"Arpita rai"
       }
       
      ])

      if(!location.state)
      {
        return navigate('/')
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
            <button className="btn btn-success mb-2">Copy Room Id</button>
            <button className="  btn btn-danger px-3 btn-block">Leave Room</button>
          </div>
        </div>

        {/* Editor */}
        <div className="col-md-10 text-light d-flex flex-column hh-100">
          <Editor/>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
