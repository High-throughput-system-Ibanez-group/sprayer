import { type Command } from "~/lib/commands";

export enum DIR {
  BACKWARD = 0,
  FORWARD = 1,
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
  count_steps: COUNT_STEPS;
  velocity: number;
};

export enum VALVE_STATE {
  CLOSED = 0,
  OPEN = 1,
}
