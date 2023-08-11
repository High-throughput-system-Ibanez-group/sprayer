import { type Socket } from "socket.io-client";

export const sendCommand = (socket: Socket, command: string) => {
  // Send command to NodeJS server via sockets
  socket.emit("sendCommand", command);
};

export const subscribeToReceivedCommand = (
  socket: Socket,
  callback: (command: string) => void
) => {
  socket.on("receivedCommand", callback);
};
