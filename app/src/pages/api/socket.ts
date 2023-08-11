import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const arduinoSerialPort = new SerialPort({
  path: process.env.ARDUINO_PORT_PATH || "COM10",
  baudRate: 9600,
});

const arduinoReadlineParser = new ReadlineParser({ delimiter: "\r\n" });

const SocketHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    const arduinoParser = arduinoSerialPort.pipe(arduinoReadlineParser);

    arduinoParser.on("open", function () {
      console.log("arduino connection is opened");
    });

    arduinoParser.on("error", (err) =>
      console.log("err creating the parser.. ", err)
    );

    arduinoSerialPort.on("error", (err) =>
      console.log("err with board connection..", err)
    );

    arduinoParser.on("data", function (receivedCommand: string) {
      io.emit("receivedCommand", receivedCommand);
      console.log("receivedCommand: ", receivedCommand);
    });

    io.on("connection", (socket) => {
      console.log("Socket connected");
      socket.on("sendCommand", (command: string) => {
        arduinoSerialPort.write(`${command}\n`, handlePortError);
        console.log("sendCommand: ", command);
      });
    });

    io.on("error", (err) => console.log("err with socket connection.. ", err));
  }
  res.end();
};

const handlePortError = (err: Error | null | undefined) => {
  if (err) {
    return console.log("err on write.. ", err?.message);
  }
};

export default SocketHandler;
