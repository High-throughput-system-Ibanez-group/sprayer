import { DIR, STEPPER_NAME, type Stepper } from "~/lib/types";

export const defStepperX: Stepper = {
  name: STEPPER_NAME.X,
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
  name: STEPPER_NAME.Y,
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
  name: STEPPER_NAME.Z,
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
  name: STEPPER_NAME.S,
  dir: DIR.FORWARD,
  microstepping: 200,
  full_rev_mm: 1,
  free_rotate: false,
  steps: 0,
  step_sleep_millis: 8,
  disable: false,
  count_steps: false,
};
