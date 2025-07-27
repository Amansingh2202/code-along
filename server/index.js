const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow frontend URL
    methods: ["GET", "POST"],
  },
});

  const userSocketMap={};

  const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    }); 
};


io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);
socket.on('join',({roomId,username})=>{
           userSocketMap[socket.id]=username;// now there are multiple users coming up with different  socket id , now we have to club them 
           // into the same room id 
           
           socket.join(roomId)// if room if exist that will  put that into that room ... if not exist will create a new room

           const clients=getAllConnectedClients(roomId);

           clients.forEach(({socketId})=>{
            io.to(socketId).emit('joined',{
                clients,
                username,
                socketId:socket.id
            })
           })
}) 

     socket.on('code-change',({roomId,code})=>{
      socket.in(roomId).emit('code-change',{ code});
     })
   
    socket.on("sync-code",({socketId,code})=>{
      io.to(socketId).emit("code-change",{code})
    })  
    //  // if new user is  joining he should get the existing code 
 

socket.on("disconnecting", () => {
  const rooms = [...socket.rooms];     

  rooms.forEach((roomId) => {
      io.to(roomId).emit("disconnected", {
          socketId: socket.id,
          username: userSocketMap[socket.id], // Fixed `socketId`
      });
      socket.leave(roomId); // Fixed incorrect syntax
  });

  delete userSocketMap[socket.id]; // Fixed typo
});


});




const PORT = process.env.PORT || 6000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
