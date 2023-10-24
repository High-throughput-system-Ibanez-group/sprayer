import { SerialPort } from "serialport";

export const readTempCont = () => {
  const sendData = [0x01, 0x04, 0x00, 0x00, 0x00, 0x01, 0x31, 0xca];

  return Buffer.from(sendData);
};

export const parseReceivedDataTempCont = (data: Buffer) => {
  // Get the temperature from the data buffer
  // the value is in the 4th and 5th byte of the buffer
  // starting on the 5th byte
  const tempByteArray = data.slice(3, 5);
  const tempHex = tempByteArray.toString('hex');
  const temp = parseInt(tempHex, 16);
  return temp;
};

export const tempToBuffer = (temp: number) => {
  const tempByte = temp.toString(16);
  const toNumberTemp = parseInt(tempByte, 16);
  const sendData = [0x01, 0x06, 0x00, 0x00, 0x00, toNumberTemp, 0x09, 0xc2];

  return Buffer.from(sendData);
};

// Function to send a command, receive a response, and print it
export async function sendCommandAndWait(port: SerialPort, command: number[]) {
  // Create a Promise that resolves when data is received
  const receivePromise = new Promise<Buffer>((resolve) => {
    port.once('data', (data: Buffer) => resolve(data));
  });

  // Send the command
  const hexBytes = Buffer.from(command);
  port.write(hexBytes);

  // Wait for and print the response
  const response = await receivePromise;
  return response;
}
