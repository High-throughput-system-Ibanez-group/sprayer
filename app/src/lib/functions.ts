import { setupStepperCommand } from "~/lib/setupCommands";
import {
  type Stepper,
  DIR,
  FREE_ROTATE,
  DISABLE,
  COUNT_STEPS,
  STEPPER_NAME,
} from "~/lib/types";

export const steperNameToString = (name: STEPPER_NAME) => {
  switch (name) {
    case STEPPER_NAME.X:
      return "X";
    case STEPPER_NAME.Y:
      return "Y";
    case STEPPER_NAME.Z:
      return "Z";
    case STEPPER_NAME.S:
      return "S";
    default:
      return "X";
  }
};

export const stepperMoveMM = (stepper: Stepper, mm: number, dir: DIR) => {
  const steps = Math.round((mm / stepper.full_rev_mm) * stepper.microstepping);
  return setupStepperCommand(
    stepper.name,
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
    stepper.name,
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
    stepper.name,
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
    stepper.name,
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
    stepper.name,
    DIR.FORWARD,
    FREE_ROTATE.OFF,
    0,
    stepper.step_sleep_millis,
    DISABLE.ON,
    COUNT_STEPS.OFF
  );
};
