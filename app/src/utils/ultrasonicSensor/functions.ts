export enum Mode {
  Standby = 0,
  Running = 1,
}

export type DataTypeUltra = {
  standbyPower: number;
  runningPower: number;
  mode: Mode;
};

export const shortToByteArray = (number: number) => {
  const byteArray = Buffer.alloc(2);

  for (let index = 0; index < byteArray.length; index++) {
    const byte = number & 0xff;
    byteArray[index] = byte;
    number = (number - byte) / 256;
  }

  return byteArray.reverse();
};

// Function to format data based on given instructions
export const formatSendDataUltrasonic = (data: DataTypeUltra) => {
  // Assuming data is an object with the required parameters
  // For example, data = { standbyPower: 300, runningPower: 500, mode: 0 }

  // Calculate the values of bit 2 and bit 3 (standby power)
  const standbyPowerValue = Math.min(20, data.standbyPower);
  const standbyPowerBits = shortToByteArray(standbyPowerValue);

  // Calculate the values of bit 4 and bit 5 (running power)
  const runningPowerValue = data.runningPower;
  const runningPowerBits = shortToByteArray(runningPowerValue);

  // Calculate the final data to be sent
  const addressCode = 0x03;
  const modeBit = data.mode === Mode.Standby ? 0x11 : 0x00;

  const sendData = [
    0xaa, // Bit0: 0xAA
    modeBit, // Bit1: mode (pause/standby or running)
    ...standbyPowerBits, // Bit2 and Bit3: standby power
    ...runningPowerBits, // Bit4 and Bit5: running power
    addressCode, // Bit6: address code
    0xdd, // Bit7: 0xDD
  ];

  return Buffer.from(sendData);
};

// Function to parse received data based on given instructions
export const parseReceivedDataUltrasonic = (data: Buffer) => {
  // Assuming data is a Buffer

  // Extracting each bit as per the given instructions
  const bit0 = data[0];
  const operationPowerValue =
    data[1] !== undefined && data[2] !== undefined
      ? (data[1] << 8) + data[2]
      : 0;
  const operationFrequency = data[3];
  const operationTimeHours = data[4];
  const operationTimeMinutes = data[5];
  const highDigitTotalOperationTime = data[6];
  const lowDigitTotalOperationTime = data[7];
  const warningMode = data[8];

  // Calculating the real power value from operationPowerValue
  const realPowerValue = operationPowerValue / 100;

  // Calculating the total operation time in hours
  const totalOperationTime =
    highDigitTotalOperationTime !== undefined &&
    lowDigitTotalOperationTime !== undefined
      ? (highDigitTotalOperationTime << 8) + lowDigitTotalOperationTime
      : 0;

  // Returning the parsed data as an object
  return {
    bit0: bit0?.toString(16),
    realPowerValue: realPowerValue?.toString(16),
    operationFrequency: operationFrequency?.toString(16),
    operationTimeHours: operationTimeHours?.toString(16),
    operationTimeMinutes: operationTimeMinutes?.toString(16),
    totalOperationTime: totalOperationTime?.toString(16),
    warningMode: warningMode?.toString(16),
  };
};
