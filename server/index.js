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


io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);
socket.on('join',({roomId,username})=>{
           userSocketMap[socket.id]=username;//since every user has unique socket id so we have to map that  id 
}) 


  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
