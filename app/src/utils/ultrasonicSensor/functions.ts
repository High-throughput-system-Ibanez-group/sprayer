export type DataTypeUltra = {
  standbyPower: number;
  runningPower: number;
  mode: number;
};
// Function to format data based on given instructions
export const formatSendDataUltrasonic = (data: DataTypeUltra) => {
  // Assuming data is an object with the required parameters
  // For example, data = { standbyPower: 300, runningPower: 500, mode: 0 }

  // Calculate the values of bit 2 and bit 3 (standby power)
  const standbyPowerValue = Math.min(0.2, data.standbyPower / 100);
  const standbyPowerHex = standbyPowerValue.toString(16).padStart(4, "0");
  const standbyPowerBits = [
    parseInt(standbyPowerHex.slice(0, 2), 16),
    parseInt(standbyPowerHex.slice(2, 4), 16),
  ];

  // Calculate the values of bit 4 and bit 5 (running power)
  const runningPowerValue = Math.min(0.2, data.runningPower / 100);
  const runningPowerHex = runningPowerValue.toString(16).padStart(4, "0");
  const runningPowerBits = [
    parseInt(runningPowerHex.slice(0, 2), 16),
    parseInt(runningPowerHex.slice(2, 4), 16),
  ];

  // Calculate the final data to be sent
  const addressCode = 0x03;
  const modeBit = data.mode === 0 ? 0x11 : 0x00;
  const verificationBit = 0xaa ^ modeBit ^ addressCode;

  const sendData = [
    0xaa, // Bit0: 0xAA
    verificationBit, // Bit7: verification of data transfer
    modeBit, // Bit1: mode (pause/standby or running)
    ...standbyPowerBits, // Bit2 and Bit3: standby power
    ...runningPowerBits, // Bit4 and Bit5: running power
    addressCode, // Bit6: address code
    0xdd, // Bit8: 0xDD
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
    bit0,
    realPowerValue,
    operationFrequency,
    operationTimeHours,
    operationTimeMinutes,
    totalOperationTime,
    warningMode,
  };
};
