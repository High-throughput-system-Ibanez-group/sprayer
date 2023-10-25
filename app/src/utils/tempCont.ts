import { type SerialPort } from "serialport";
import * as crc from "crc";

export const parseReceivedDataTempCont = (data: Buffer) => {
  // Get the temperature from the data buffer
  // the value is in the 4th and 5th byte of the buffer
  // starting on the 5th byte
  const tempByteArray = data.slice(3, 5);
  const tempHex = tempByteArray.toString("hex");
  const temp = parseInt(tempHex, 16);
  return temp;
};

function decimalToHex2Bytes(decimal: number) {
  const hexValue = decimal.toString(16).padStart(4, "0");
  // Take the least significant 2 bytes
  return hexValue.slice(-4);
}

export const tempToBuffer = (temp: number) => {
  const originalBytes = [0x01, 0x06, 0x00, 0x00];
  const decimalValue = temp;

  // Convert decimalValue to a 2-byte hexadecimal representation
  const hexValue = decimalToHex2Bytes(decimalValue);

  // Combine the original bytes and the converted hexValue
  const combinedBytes = originalBytes.concat([
    parseInt(hexValue.slice(0, 2), 16),
    parseInt(hexValue.slice(2, 4), 16),
  ]);

  console.log("combinedBytes:", Buffer.from(combinedBytes).toString("hex"));
  const checksum = crc.crc16modbus(Buffer.from(combinedBytes));
  // Convert the checksum to two hexadecimal bytes
  const checksumBytes = [
    checksum & 0xff, // Least significant byte (LSB)
    (checksum >> 8) & 0xff, // Most significant byte (MSB)
  ];
  const finalBytes = combinedBytes.concat(checksumBytes);
  console.log("finalBytes:", Buffer.from(finalBytes).toString("hex"));
  return finalBytes;
};

// Function to send a command, receive a response, and print it
export async function sendCommandAndWait(port: SerialPort, command: number[]) {
  // Create a Promise that resolves when data is received
  const receivePromise = new Promise<Buffer>((resolve) => {
    port.once("data", (data: Buffer) => resolve(data));
  });

  // Send the command
  const hexBytes = Buffer.from(command);
  port.write(hexBytes);

  // Wait for and print the response
  const response = await receivePromise;
  return response;
}
