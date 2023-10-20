/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import {
  parseReceivedDataTempCont,
  readTempCont,
  tempToBuffer,
} from "~/utils/tempCont";
// import * as fs from "fs";
// import { AvrgirlArduino } from "avrgirl-arduino";


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
});

const serialPortTempCont = new SerialPort({
  path: process.env.TEMP_CONT_PORT_PATH || "COM10",
  baudRate: 9600,
  dataBits: 8,    // 8 data bits
  stopBits: 1,    // 1 stop bit
  parity: 'even', // Set the parity to even
});

// Function to send data through SerialPort
const sendDataUltra = (data: Buffer) => {
  serialPortUltra.write(data, (err) => {
    if (err) {
      console.log("Error sending ultrasonic data:", err);
    } else {
      console.log("Data sent:", data);
    }
  });
};

const arduinoReadlineParser = new ReadlineParser({ delimiter: "\r\n" });
const ultraReadlineParser = new ReadlineParser({ delimiter: "\r\n" });
// const readlineParserTempCont = new ReadlineParser();

const arduinoParser = arduinoSerialPort.pipe(arduinoReadlineParser);
const parserUltra = serialPortUltra.pipe(ultraReadlineParser);
const parserTempCont = serialPortTempCont

export const getArduinoSerialPortState = () => arduinoSerialPort.isOpen;
export const openArduinoSerialPort = () => arduinoSerialPort.open();

// interface UploadResult {
//   success: boolean;
//   error?: string;
// }
// export const uploadBoard = (): Promise<UploadResult> => {
//   return new Promise((resolve) => {
//     console.log("Uploading firmware to board...");

//     // Read the firmware file into a buffer
//     const firmware = fs.readFileSync("../../../../mega/mega.ino");

//     // Create a new instance of AvrgirlArduino
//     const avrgirl = new AvrgirlArduino({
//       board: "mega",
//       debug: true,
//     });

//     // Upload the firmware to the board
//     avrgirl.flash(firmware, (error: { message: string }) => {
//       if (error) {
//         console.error("Error uploading firmware:", error);
//         resolve({ error: error.message, success: false });
//       } else {
//         console.log("Firmware uploaded successfully");
//         arduinoSerialPort.open();
//         resolve({ success: true });
//       }
//     });
//   });
// };

const SocketHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    arduinoParser.on("open", function () {
      console.log("arduino connection is opened");
    });

    arduinoParser.on("error", (err) =>
      console.log("err creating the parser.. ", err)
    );

    arduinoSerialPort.on("error", (err) =>
      console.log("err with board connection..", err)
    );

    serialPortUltra.on("error", (err) =>
      console.log("err with ultrasonic connection..", err)
    );

    serialPortTempCont.on("error", (err) =>
      console.log("err with temperature controller connection..", err)
    );

    arduinoParser.on("data", function (receivedCommand: string) {
      io.emit("receivedCommand", receivedCommand);
      console.log("receivedCommand: ", receivedCommand);
    });

    parserUltra.on("data", (data: Buffer) => {
      // Process the received data following the given instructions
      const parsedData = parseReceivedDataUltrasonic(data);
      console.log("Received Ultrasonic Data:", parsedData);
    });

    parserTempCont.on("data", (data: Buffer) => {
      console.log("TEMP: Received Temperature Controller Data:", data);
      io.emit("receivedTempData", parseReceivedDataTempCont(data));
    });

    io.on("connection", (socket) => {
      console.log("Socket connected");

      socket.on("checkArduinoSerialPortState", () => {
        console.log("Checking Arduino serial port state...");
        socket.emit("arduinoSerialPortState", arduinoSerialPort.isOpen);
      });

      socket.on("sendCommand", (command: string) => {
        arduinoSerialPort.write(`${command}\n`, handlePortError);
        console.log("sendCommand: ", command);
      });

      // Event handler for sending data from the client to the RS485 device
      socket.on("sendDataToRS485", (data: DataTypeUltra) => {
        // Format the data based on the given instructions
        console.log("Data to send:", data);
        const formattedData = formatSendDataUltrasonic(data);
        console.log("Formatted data -> ", formattedData);
        sendDataUltra(formattedData);
      });

      socket.on("readTemperature", () => {
        const data = readTempCont();

        serialPortTempCont.write(`${data}\n`, (err) => {
          if (err) {
            console.log("TEMP: Error sending temp data:", err);
          } else {
            console.log("TEMP: Data sent:", data);
          }
        });
      });

      socket.on("setTemperature", (temp: number) => {
        const data = tempToBuffer(temp);

        serialPortTempCont.write(data, (err) => {
          if (err) {
            console.log("TEMP: Error sending temp data:", err);
          } else {
            console.log("TEMP: Data sent:", data);
          }
        });
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
