import { Command } from "~/lib/commands";
import { setupStepperCommand } from "~/lib/setupCommands";
import {
  type Stepper,
  DIR,
  FREE_ROTATE,
  DISABLE,
  COUNT_STEPS,
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

export const stepperMoveMM = (stepper: Stepper, mm: number, dir: DIR) => {
  const steps = Math.round((mm / stepper.full_rev_mm) * stepper.microstepping);
  return setupStepperCommand(
    stepper.command,
    dir,
    FREE_ROTATE.OFF,
    steps,
    stepper.step_sleep_millis,
    DISABLE.OFF,
    COUNT_STEPS.OFF
  );
};

export const stepperZeroingStart = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.BACKWARD,
    FREE_ROTATE.ON,
    0,
    stepper.step_sleep_millis,
    DISABLE.OFF,
    COUNT_STEPS.OFF
  );
};

export const stepperZeroingEnd = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.FORWARD,
    FREE_ROTATE.ON,
    0,
    stepper.step_sleep_millis,
    DISABLE.OFF,
    COUNT_STEPS.OFF
  );
};

export const stepperStop = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.FORWARD,
    FREE_ROTATE.OFF,
    0,
    stepper.step_sleep_millis,
    DISABLE.OFF,
    COUNT_STEPS.OFF
  );
};

export const stepperDisable = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.FORWARD,
    FREE_ROTATE.OFF,
    0,
    stepper.step_sleep_millis,
    DISABLE.ON,
    COUNT_STEPS.OFF
  );
};

export const stepperCountSteps = (stepper: Stepper) => {
  return setupStepperCommand(
    stepper.command,
    DIR.FORWARD,
    FREE_ROTATE.OFF,
    0,
    stepper.step_sleep_millis,
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
      return String.fromCharCode(0);
  }
};
