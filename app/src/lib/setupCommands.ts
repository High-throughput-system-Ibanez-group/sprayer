import { STEPPER_COMMAND } from "~/lib/commands";
import {
  type COUNT_STEPS,
  type DIR,
  type DISABLE,
  type FREE_ROTATE,
  type STEPPER_NAME,
} from "~/lib/types";

// type PropsSetupStepperCommand = {
//   name: STEPPER_NAME;
//   dir: number;
//   free_rotate: number;
//   steps: number;
//   step_sleep_millis: number;
//   disable: number;
//   count_steps: number;
// };

export const setupStepperCommand = (
  name: STEPPER_NAME,
  dir: DIR,
  free_rotate: FREE_ROTATE,
  steps: number,
  step_sleep_millis: number,
  disable: DISABLE,
  count_steps: COUNT_STEPS
) => {
  const command = `${STEPPER_COMMAND.toString(16)} ${name} ${dir} ${free_rotate} ${steps} ${step_sleep_millis} ${disable} ${count_steps}`;
  return command;
};
