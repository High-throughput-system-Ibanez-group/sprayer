import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { appStore } from "~/store/app";
import { type Axis } from "~/utils/types";

export const WorkingSpace = observer(() => {
  const app = appStore();
  const socket = app.socket;
  const refInputX = useRef<HTMLInputElement>(null);
  const refInputY = useRef<HTMLInputElement>(null);
  const refInputZ = useRef<HTMLInputElement>(null);

  const handleStepperSubmit = (stepperAxis: Axis) => {
    console.log("Stepper button clicked");
    let value;
    switch (stepperAxis) {
      case "x":
        value = refInputX.current?.value;
        break;
      case "y":
        value = refInputY.current?.value;
        break;
      case "z":
        value = refInputZ.current?.value;
        break;
      default:
        console.log("No option selected");
    }
    if (value) {
      socket?.emit("command", `stepper_${stepperAxis}:${value}`);
    }
  };

  const updateAll = () => {
    if (refInputX.current?.value) {
      socket?.emit("command", `stepper_x:${refInputX.current?.value}`);
    }
    if (refInputY.current?.value) {
      socket?.emit("command", `stepper_y:${refInputY.current?.value}`);
    }
    if (refInputZ.current?.value) {
      socket?.emit("command", `stepper_z:${refInputZ.current?.value}`);
    }
  };

  return (
    <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
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
              ref={refInputX}
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
              handleStepperSubmit("x");
            }}
          >
            Update x
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
            ref={refInputY}
            readOnly
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              handleStepperSubmit("y");
            }}
          >
            Update y
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
            ref={refInputZ}
            readOnly
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              handleStepperSubmit("z");
            }}
          >
            Update z
          </button>
        </div>
        <div className="h-6" />
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={updateAll}
        >
          Update all
        </button>
      </div>
    </div>
  );
});
