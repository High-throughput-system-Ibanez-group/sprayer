import { type Command } from "~/lib/commands";

export enum DIR {
  FORWARD = 0,
  BACKWARD = 1,
}

export enum FREE_ROTATE {
  OFF = 0,
  ON = 1,
}

export enum DISABLE {
  OFF = 0,
  ON = 1,
}

export enum COUNT_STEPS {
  OFF = 0,
  ON = 1,
}

export type Stepper = {
  command: Command;
  microstepping: number;
  full_rev_mm: number;
  free_rotate: boolean;
  dir: DIR;
  steps: number;
  step_sleep_millis: number;
  disable: boolean;
  count_steps: boolean;
};
