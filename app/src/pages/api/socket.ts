import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import {
  type DataTypeUltra,
  formatSendDataUltrasonic,
  parseReceivedDataUltrasonic,
} from "~/utils/ultrasonicSensor/functions";

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

// Configure SerialPort for RS485 ultrasonic sensor communication
const serialPortUltra = new SerialPort({
  path: process.env.ULTRASONIC_PORT_PATH || "COM10",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
});

const parserUltra = serialPortUltra.pipe(new ReadlineParser());

// Function to send data through SerialPort
const sendDataUltra = (data: Buffer) => {
  serialPortUltra.write(data, (err) => {
    if (err) {
      console.error("Error sending data:", err);
    } else {
      console.log("Data sent:", data);
    }
  });
};

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

    // Event handler for receiving data from the SerialPort
    parserUltra.on("data", (data: Buffer) => {
      // Process the received data following the given instructions
      const parsedData = parseReceivedDataUltrasonic(data);
      console.log("Received Ultrasonic Data:", parsedData);
    });

    io.on("connection", (socket) => {
      console.log("Socket connected");
      socket.on("sendCommand", (command: string) => {
        arduinoSerialPort.write(`${command}\n`, handlePortError);
        console.log("sendCommand: ", command);
      });

      // Event handler for sending data from the client to the RS485 device
      socket.on("sendDataToRS485", (data: DataTypeUltra) => {
        // Format the data based on the given instructions
        const formattedData = formatSendDataUltrasonic(data);
        sendDataUltra(formattedData);
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
