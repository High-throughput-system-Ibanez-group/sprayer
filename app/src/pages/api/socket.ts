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

let serialPort = new SerialPort({
  path: process.env.PORT_PATH || "",
  baudRate: 9600,
});

const readlineParser = new ReadlineParser({ delimiter: "\r\n" });

let parser = serialPort.pipe(readlineParser);

function configSerialPort() {
  serialPort = new SerialPort({
    path: process.env.PORT_PATH || "",
    baudRate: 9600,
  });
  parser = serialPort.pipe(readlineParser);
}

const SocketHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    configSerialPort();
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    configSerialPort();

    parser.on("open", function () {
      console.log("connection is opened");
    });

    parser.on("data", function (data) {
      console.log("data from board: ", data);
    });

    parser.on("error", (err) => console.log("err creating the parser.. ", err));

    serialPort.on("error", (err) =>
      console.log("err with board connection..", err)
    );

    io.on("connection", (socket) => {
      socket.on("command", (command: string) => {
        serialPort.write(`${command}\n`, (err) => {
          if (err) {
            return console.log("err on write.. ", err?.message);
          }
        });
        console.log("Command: ", command);
      });
    });
  }
  res.end();
};

export default SocketHandler;
