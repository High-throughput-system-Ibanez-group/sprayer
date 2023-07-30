import { setupStepperCommand } from "~/lib/setupCommands";
import { type Stepper, type DIR } from "~/lib/types";

export const steperNameToString = (name: number) => {
  switch (name) {
    case 0:
      return "X";
    case 1:
      return "Y";
    case 2:
      return "Z";
    case 3:
      return "S";
    default:
      return "X";
  }
};

export const stepperMoveMM = (stepper: Stepper, mm: number, dir: DIR) => {
  const steps = Math.round((mm / stepper.full_rev_mm) * stepper.microstepping);
  setupStepperCommand({
    name: stepper.name,
    dir,
    free_rotate: 0,
    steps,
    step_sleep_millis: stepper.step_sleep_millis,
    disable: 0,
    count_steps: 0,
  });
};
