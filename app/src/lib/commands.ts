export const STEPPER_COMMAND_X = 0x41;
export const STEPPER_COMMAND_Y = 0x42;
export const STEPPER_COMMAND_Z = 0x43;
export const STEPPER_COMMAND_S = 0x44;
export const SET_PRESSURE_COMMAND = 0x45;
export const GET_PRESSURE_COMMAND = 0x46;
export const SET_VALVE_COMMMAND_1 = 0x47;
export const SET_VALVE_COMMMAND_2 = 0x48;
export const STEPPER_DISABLED_COMMAND = 0x49;
export const GET_STEPPER_STEPS_COMMAND = 0x4a;
export const FINISH_COMMAND = 0x4b;

// create a type for all the possible commands
export type Command =
  | typeof STEPPER_COMMAND_X
  | typeof STEPPER_COMMAND_Y
  | typeof STEPPER_COMMAND_Z
  | typeof STEPPER_COMMAND_S
  | typeof SET_PRESSURE_COMMAND
  | typeof GET_PRESSURE_COMMAND
  | typeof SET_VALVE_COMMMAND_1
  | typeof SET_VALVE_COMMMAND_2
  | typeof STEPPER_DISABLED_COMMAND
  | typeof GET_STEPPER_STEPS_COMMAND
  | typeof FINISH_COMMAND;
