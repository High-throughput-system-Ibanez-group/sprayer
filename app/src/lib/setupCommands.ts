import { STEPPER_COMMAND } from "~/lib/commands";
import { type STEPPER_NAME } from "~/lib/types";

type PropsSetupStepperCommand = {
  name: STEPPER_NAME;
  dir: number;
  free_rotate: number;
  steps: number;
  step_sleep_millis: number;
  disable: number;
  count_steps: number;
};

export const setupStepperCommand = ({
  name,
  dir,
  free_rotate,
  steps,
  step_sleep_millis,
  disable,
  count_steps,
}: PropsSetupStepperCommand) => {
  const buffer = Buffer.alloc(29);
  buffer.writeUInt8(STEPPER_COMMAND, 0);
  buffer.writeUInt32BE(name, 1);
  buffer.writeUInt32BE(dir, 5);
  buffer.writeUInt32BE(free_rotate, 9);
  buffer.writeUInt32BE(steps, 13);
  buffer.writeUInt32BE(step_sleep_millis, 17);
  buffer.writeUInt32BE(disable, 21);
  buffer.writeUInt32BE(count_steps, 25);
  return buffer;
};
