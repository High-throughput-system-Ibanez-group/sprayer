import { SerialPort } from "serialport";

void SerialPort.list().then(function (ports) {
  ports.forEach(function (port) {
    console.log("Port ", port);
  });
});
