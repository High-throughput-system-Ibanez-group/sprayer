import { type Command } from "~/lib/commands";
import {
  type COUNT_STEPS,
  type DIR,
  type DISABLE,
  type FREE_ROTATE,
} from "~/lib/types";

export const setupStepperCommand = (
  command: Command,
  dir: DIR,
  free_rotate: FREE_ROTATE,
  steps: number,
  step_sleep_millis: number,
  disable: DISABLE,
  count_steps: COUNT_STEPS
) => {
  return `${String.fromCharCode(
    command
  )}:${dir}:${free_rotate}:${steps}:${step_sleep_millis}:${disable}:${count_steps}`;
};
