import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  WORKING_SPACE_X_SEQUENCE,
  WORKING_SPACE_Y_SEQUENCE,
  WORKING_SPACE_Z_SEQUENCE,
} from "~/lib/sequences";
import { appStore } from "~/stores/app";
import { type Axis } from "~/utils/types";

export const WorkingSpace = observer(() => {
  const { executeCommandSequence } = appStore();

  const [state, setState] = useState({
    x: {
      loading: false,
      value: "",
    },
    y: {
      loading: false,
      value: "",
    },
    z: {
      loading: false,
      value: "",
    },
  });

  const handleStepperSubmit = async (stepperAxis: Axis) => {
    setState((prev) => ({
      ...prev,
      [stepperAxis]: {
        ...prev[stepperAxis],
        loading: true,
      },
    }));
    const value = await executeCommandSequence(
      stepperAxis === "x"
        ? WORKING_SPACE_X_SEQUENCE
        : stepperAxis === "y"
        ? WORKING_SPACE_Y_SEQUENCE
        : WORKING_SPACE_Z_SEQUENCE
    );
    setState((prev) => ({
      ...prev,
      [stepperAxis]: {
        ...prev[stepperAxis],
        loading: false,
        value,
      },
    }));
  };

  return (
    <div className="flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Working Space</div>
      <div className="h-4" />
      <div className="flex flex-col py-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="font-medium">
            x:
          </label>
          <div className="relative">
            <input
              type="number"
              id="number-input"
              className="w-32 rounded-md border border-gray-300 px-3 py-2"
              value={state.x.value}
              readOnly
            />
            <div className="absolute -top-8 left-0 flex w-full justify-center">
              (mm)
            </div>
          </div>

          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              void handleStepperSubmit("x");
            }}
          >
            {state.x.loading ? "Loading.." : "Update x"}
          </button>
        </div>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="font-medium">
            y:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            value={state.y.value}
            readOnly
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              void handleStepperSubmit("y");
            }}
          >
            {state.y.loading ? "Loading.." : "Update y"}
          </button>
        </div>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="font-medium">
            z:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            value={state.z.value}
            readOnly
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              void handleStepperSubmit("z");
            }}
          >
            {state.z.loading ? "Loading.." : "Update z"}
          </button>
        </div>
      </div>
    </div>
  );
});
