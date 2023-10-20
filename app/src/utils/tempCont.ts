export const readTempCont = () => {
  const sendData = [0x01, 0x04, 0x00, 0x00, 0x00, 0x01, 0x31, 0xca];

  return Buffer.from(sendData);
};

export const parseReceivedDataTempCont = (data: Buffer) => {
  const binaryTemp = data[3]?.toString() || "";
  const temp = parseInt(binaryTemp, 16);

  console.log("TEMP PARSED: ", temp)
  return temp;
};

export const tempToBuffer = (temp: number) => {
  const tempByte = temp.toString(16);
  const toNumberTemp = parseInt(tempByte, 16);
  const sendData = [0x01, 0x06, 0x00, 0x00, 0x00, toNumberTemp, 0x09, 0xc2];

  return Buffer.from(sendData);
};
