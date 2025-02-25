import { io } from "socket.io-client";

// const BACKEND_URL = "http://localhost:5000"; // Ensure this matches your backend port

export const initSocket = async () => {
  return io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 5, // Retry connection 5 times
    timeout: 5000, // Wait 5 seconds before failing
  });
};
