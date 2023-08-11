import { type Socket } from "socket.io-client";
import { FINISH_COMMAND } from "~/lib/commands";
import { sendCommand, subscribeToReceivedCommand } from "~/lib/communication";

export const executeCommand = async (socket: Socket, command: string) => {
  // Send the command to the Arduino
  sendCommand(socket, command);

  // Wait for the finish command from the Arduino
  return await new Promise<string[]>((resolve) => {
    const finishCommandHandler = (receivedCommand: string) => {
      const finishingCommand = `${FINISH_COMMAND}:${command}`;
      if (receivedCommand.includes(finishingCommand)) {
        const args = receivedCommand.split(":").slice(2);
        resolve(args);
      }
    };
    subscribeToReceivedCommand(socket, finishCommandHandler);
  });
};
