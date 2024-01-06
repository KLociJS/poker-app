import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket, io } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

export const initSocket = () => {
  socket = io("http://localhost:3001", { autoConnect: false });
};

export const connectSocket = () => {
  if (socket) {
    console.log("Connecting socket...");
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting socket...");
    socket.disconnect();
  }
};

export const getSocket = () => {
  return socket;
};
