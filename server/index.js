const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Add CORS to allow WebSocket connections from the frontend
const io = new Server(server, {
    cors: {
        origin: "*", // Change this to your frontend URL in production
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", ({ roomId, username }) => {
        socket.join(roomId);
        console.log(`${username} joined room ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
