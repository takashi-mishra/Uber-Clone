import { io } from "socket.io-client";

// Automatically uses correct URL from Vite env
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});


