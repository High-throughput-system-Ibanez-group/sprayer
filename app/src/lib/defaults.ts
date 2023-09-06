import { Command } from "~/lib/commands";
import { COUNT_STEPS, DIR, type Stepper } from "~/lib/types";

export const defStepperX: Stepper = {
  command: Command.STEPPER_COMMAND_X,
  dir: DIR.FORWARD,
  microstepping: 400,
  full_rev_mm: 54,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: COUNT_STEPS.OFF,
  velocity: 10,
};

export const defStepperY: Stepper = {
  command: Command.STEPPER_COMMAND_Y,
  dir: DIR.FORWARD,
  microstepping: 400,
  full_rev_mm: 54,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: COUNT_STEPS.OFF,
  velocity: 10,
};

export const defStepperZ: Stepper = {
  command: Command.STEPPER_COMMAND_Z,
  dir: DIR.FORWARD,
  microstepping: 400,
  full_rev_mm: 44,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: COUNT_STEPS.OFF,
  velocity: 10,
};

export const defStepperS: Stepper = {
  command: Command.STEPPER_COMMAND_S,
  dir: DIR.FORWARD,
  microstepping: 200,
  full_rev_mm: 1,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: COUNT_STEPS.OFF,
  velocity: 0.1,
};
