import { type Socket } from "socket.io-client";
import { Command } from "~/lib/commands";
import { sendCommand, subscribeToReceivedCommand } from "~/lib/communication";

export const executeCommand = async (socket: Socket, command: string) => {
  // send the command
  sendCommand(socket, command);

  // wait for the finish command
  return await new Promise<string[]>((resolve) => {
    const finishCommandHandler = (receivedCommand: string) => {
      const commandName = (command.split(":")[0] || "").charCodeAt(0);
      const finishingCommand = `${Command.FINISH_COMMAND}:${commandName}`;
      if (receivedCommand.includes(finishingCommand)) {
        const args = receivedCommand.split(":").slice(2);
        resolve(args);
      }
    };
    subscribeToReceivedCommand(socket, finishCommandHandler);
  });
};
