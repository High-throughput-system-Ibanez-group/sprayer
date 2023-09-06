import { type Socket } from "socket.io-client";

export const sendCommand = (socket: Socket, command: string) => {
  socket.emit("sendCommand", command);
};

export const subscribeToReceivedCommand = (
  socket: Socket,
  callback: (command: string) => void
) => {
  socket.on("receivedCommand", callback);
};
