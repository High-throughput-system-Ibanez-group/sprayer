export enum DIR {
  FORWARD = 0,
  BACKWARD = 1,
}

export enum STEPPER_NAME {
  X = 0,
  Y = 1,
  Z = 2,
  S = 3,
}

export type Stepper = {
  name: STEPPER_NAME;
  microstepping: number;
  full_rev_mm: number;
  free_rotate: boolean;
  dir: DIR;
  steps: number;
  step_sleep_millis: number;
  disable: boolean;
  count_steps: boolean;
};
