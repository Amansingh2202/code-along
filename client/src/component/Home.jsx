import  {v4 as uuid} from "uuid"
import { useState } from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom"


const Home = () => {
    const [roomId,setRoomId]=useState("");
    const [username,setUsername]=useState('');
    const navigate=useNavigate();    

    const generateRoomId=(e)=>{
        e.preventDefault();
        const id=uuid();
        setRoomId(id);
        toast.success("Room id is generated ")
    }
     const joinRoom=()=>{
        if(!roomId || !username)
        {
            toast.error("Please  fill the fields properly")
            return;
        }
        navigate(`/editor/${roomId}`,{
            state:{username},  
        })
        toast.success("room is Created ")
     }


  return  <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100 ">
         <div className="col-12 col-md-6">
             <div className="card shadow-sm p-2 mb-5 bg-secondry rounded">
                <div className="card-body text-center bg-dark">
                    
                    <h1 className="text-white mb-5 ">  Code-along</h1>
                    {/* <img className="  mx-auto d-block  bg-transparent" src="/images/personal-computer.png" alt="Code-along" style={{maxWidth:"100", maxHeight:"100"}}/> */}
                    {/* <h2 className="text-light">Enter the room Id</h2> */}
                    <div className="form-group" >


                        <input  value={roomId}
                        onChange={(e)=>setRoomId(e.target.value)}
                        type="text" 
                        className="  form-control mb-2"
                         placeholder="Room Id" />

                    </div>
                    <div className="form-group" >


                     
                           <input  onChange={(e)=>setUsername(e.target.value)}
                            type="text" 
                             className=" form-control mb-2" 
                             placeholder="username" />

                          </div>
                          <button  onClick={joinRoom} className="btn btn-success btn-lg  btn-block">JOIN</button>
                          <p className=" mt-3 text-white">Don&apos;t have a Room Id ? <span  
                            onClick={generateRoomId}
                           className="text-success p-2 " style={{cursor:"pointer"}}>New Room </span></p>
                </div>
             </div>

         </div>
      </div>

  </div>
   
  
}

export default Home
