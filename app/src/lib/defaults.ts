import {
  STEPPER_COMMAND_S,
  STEPPER_COMMAND_X,
  STEPPER_COMMAND_Y,
  STEPPER_COMMAND_Z,
} from "~/lib/commands";
import { DIR, type Stepper } from "~/lib/types";

export const defStepperX: Stepper = {
  command: STEPPER_COMMAND_X,
  dir: DIR.FORWARD,
  microstepping: 400,
  full_rev_mm: 54,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: false,
};

export const defStepperY: Stepper = {
  command: STEPPER_COMMAND_Y,
  dir: DIR.FORWARD,
  microstepping: 400,
  full_rev_mm: 54,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: false,
};

export const defStepperZ: Stepper = {
  command: STEPPER_COMMAND_Z,
  dir: DIR.FORWARD,
  microstepping: 400,
  full_rev_mm: 44,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: false,
};

export const defStepperS: Stepper = {
  command: STEPPER_COMMAND_S,
  dir: DIR.FORWARD,
  microstepping: 200,
  full_rev_mm: 1,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: false,
};
