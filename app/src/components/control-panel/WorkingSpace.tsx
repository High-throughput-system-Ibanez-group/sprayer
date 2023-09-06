import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Command } from "~/lib/commands";
import {
  WORKING_SPACE_X_SEQUENCE,
  WORKING_SPACE_Y_SEQUENCE,
  WORKING_SPACE_Z_SEQUENCE,
} from "~/lib/sequences";
import { steperCommandToString } from "~/lib/setupCommands";
import { type Stepper } from "~/lib/types";
import { appStore } from "~/stores/app";

export const WorkingSpace = observer(() => {
  const app = appStore();

  return (
    <div className="flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Working space</div>
      <div className="flex flex-col items-center justify-center py-6">
        <div>(mm)</div>
        <Space stepper={app.stepperX} />
        <Space stepper={app.stepperY} />
        <Space stepper={app.stepperZ} />
      </div>
    </div>
  );
});

const getStepperSequenceFromStepper = (stepper: Stepper) => {
  if (stepper.command === Command.STEPPER_COMMAND_X) {
    return WORKING_SPACE_X_SEQUENCE;
  } else if (stepper.command === Command.STEPPER_COMMAND_Y) {
    return WORKING_SPACE_Y_SEQUENCE;
  } else {
    return WORKING_SPACE_Z_SEQUENCE;
  }
};

const Space = observer(({ stepper }: { stepper: Stepper }) => {
  const { executeCommandSequence } = appStore();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const sequence = getStepperSequenceFromStepper(stepper);

  const handleStepperSubmit = async () => {
    setLoading(true);
    const value = (await executeCommandSequence(sequence)) as unknown as string;
    if (!value) return;
    const steps = parseInt(value);
    const mm = steps * (stepper.full_rev_mm / (stepper.microstepping * 2));
    setValue(mm.toString());
    setLoading(false);
  };

  const stepperName = steperCommandToString(stepper.command);

  return (
    <>
      <div className="h-4" />
      <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="font-medium">
          {stepperName}
        </label>
        <div className="relative">
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            value={value}
            readOnly
          />
        </div>
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            void handleStepperSubmit();
          }}
        >
          {loading ? "Loading.." : `Update ${stepperName}`}
        </button>
      </div>
    </>
  );
});
