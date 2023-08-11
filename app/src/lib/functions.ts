import {
  type Command,
  STEPPER_COMMAND_S,
  STEPPER_COMMAND_X,
  STEPPER_COMMAND_Y,
  STEPPER_COMMAND_Z,
} from "~/lib/commands";
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
    case STEPPER_COMMAND_X:
      return "X";
    case STEPPER_COMMAND_Y:
      return "Y";
    case STEPPER_COMMAND_Z:
      return "Z";
    case STEPPER_COMMAND_S:
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

export const zeroingStart = (stepper: Stepper) => {
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

export const zeroingEnd = (stepper: Stepper) => {
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
  // TODO: Await zeroing start to end and then disable
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
