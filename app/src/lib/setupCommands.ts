import { Command } from "~/lib/commands";
import {
  type Stepper,
  DIR,
  FREE_ROTATE,
  DISABLE,
  COUNT_STEPS,
  type VALVE_STATE,
} from "~/lib/types";

export const steperCommandToString = (command: Command) => {
  switch (command) {
    case Command.STEPPER_COMMAND_X:
      return "X";
    case Command.STEPPER_COMMAND_Y:
      return "Y";
    case Command.STEPPER_COMMAND_Z:
      return "Z";
    case Command.STEPPER_COMMAND_S:
      return "S";
    default:
      return "X";
  }
};

export const getDelayMicros = (stepper: Stepper) => {
  return Math.round(
    (1e6 * stepper.full_rev_mm) / (2 * stepper.velocity * stepper.microstepping)
  );
};

export const stepperMoveMM = (stepper: Stepper, mm: number, dir: DIR) => {
  const steps = Math.round(
    (2 * stepper.microstepping * mm) / stepper.full_rev_mm
  );
  return setupStepperCommand(
    stepper.command,
    dir,
    FREE_ROTATE.OFF,
    steps,
    stepper.step_sleep_micros,
    DISABLE.OFF,
    stepper.count_steps
  );
};
export const stepperMoveMMWithoutDir = (stepper: Stepper, mm: number) => {
  const steps = Math.round(
    (2 * stepper.microstepping * mm) / stepper.full_rev_mm
  );
  return setupStepperCommand(
    stepper.command,
    mm > 0 ? DIR.FORWARD : DIR.BACKWARD,
    FREE_ROTATE.OFF,
    steps,
    stepper.step_sleep_micros,
    DISABLE.OFF,
    stepper.count_steps
  );
};

export const stepperZeroingStart = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.BACKWARD,
    FREE_ROTATE.ON,
    0,
    stepper.step_sleep_micros,
    DISABLE.OFF,
    stepper.count_steps
  );
};

export const stepperZeroingEnd = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.FORWARD,
    FREE_ROTATE.ON,
    0,
    stepper.step_sleep_micros,
    DISABLE.OFF,
    stepper.count_steps
  );
};

export const stepperStop = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.FORWARD,
    FREE_ROTATE.OFF,
    0,
    stepper.step_sleep_micros,
    DISABLE.OFF,
    stepper.count_steps
  );
};

export const stepperDisable = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.FORWARD,
    FREE_ROTATE.OFF,
    0,
    stepper.step_sleep_micros,
    DISABLE.ON,
    stepper.count_steps
  );
};

export const stepperCountSteps = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.FORWARD,
    FREE_ROTATE.OFF,
    0,
    stepper.step_sleep_micros,
    DISABLE.OFF,
    COUNT_STEPS.ON
  );
};

export const getStepperStepsCommand = (stepper: Stepper) => {
  switch (stepper.command) {
    case Command.STEPPER_COMMAND_X:
      return String.fromCharCode(Command.GET_STEPPER_STEPS_COMMAND_X);
    case Command.STEPPER_COMMAND_Y:
      return String.fromCharCode(Command.GET_STEPPER_STEPS_COMMAND_Y);
    case Command.STEPPER_COMMAND_Z:
      return String.fromCharCode(Command.GET_STEPPER_STEPS_COMMAND_Z);
    default:
      throw new Error(`Unexpected stepper command: ${stepper.command}`);
  }
};

export const getPressureCommand = () => {
  return String.fromCharCode(Command.GET_PRESSURE_COMMAND);
};

export const setPressureCommand = (val: number) => {
  return `${String.fromCharCode(Command.SET_PRESSURE_COMMAND)}:${val}`;
};

export const setValve1Command = (val: VALVE_STATE) => {
  return `${String.fromCharCode(Command.SET_VALVE_COMMMAND_1)}:${val}`;
};

export const setValve2Command = (val: VALVE_STATE) => {
  return `${String.fromCharCode(Command.SET_VALVE_COMMMAND_2)}:${val}`;
};

export const setupStepperCommand = (
  command: Command,
  dir: DIR,
  free_rotate: FREE_ROTATE,
  steps: number,
  step_sleep_micros: number,
  disable: DISABLE,
  count_steps: COUNT_STEPS
) => {
  return `${String.fromCharCode(
    command
  )}:${dir}:${free_rotate}:${steps}:${step_sleep_micros}:${disable}:${count_steps}`;
};
