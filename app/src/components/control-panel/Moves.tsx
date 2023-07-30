import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { steperNameToString, stepperMoveMM } from "~/lib/functions";
import { DIR, type Stepper } from "~/lib/types";
import { appStore } from "~/stores/app";
import { componentsStore } from "~/stores/components";

export const Moves = observer(() => {
  const components = componentsStore();

  return (
    <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Moves</div>
      <div className="flex flex-col py-6">
        <Move stepper={components.stepperX} />
        <Move stepper={components.stepperY} />
        <Move stepper={components.stepperZ} />
        <Move stepper={components.stepperS} />
      </div>
    </div>
  );
});

const Move = ({ stepper }: { stepper: Stepper }) => {
  const app = appStore();
  const socket = app.socket;
  const refMm = useRef<HTMLInputElement>(null);

  const onSpecificMove = (stepper: Stepper, dir: DIR, mm: number) => {
    if (socket) {
      socket.emit("command", stepperMoveMM(stepper, mm, dir));
    }
  };

  return (
    <>
      <div className="h-4" />
      <div className="relative flex items-center space-x-4">
        <label htmlFor="number-input" className="absolute -left-4 font-medium">
          {steperNameToString(stepper.name)}:
        </label>
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            onSpecificMove(
              stepper,
              DIR.BACKWARD,
              refMm.current?.valueAsNumber || 0
            );
          }}
        >
          -
        </button>
        <div className="relative">
          <input
            type="number"
            id="number-input"
            className="w-16 rounded-md border border-gray-300 px-3 py-2"
            ref={refMm}
            min="0"
          />
          <div className="absolute -top-8 left-0 flex w-full justify-center">
            (mm)
          </div>
        </div>
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            onSpecificMove(
              stepper,
              DIR.FORWARD,
              refMm.current?.valueAsNumber || 0
            );
          }}
        >
          +
        </button>
      </div>
    </>
  );
};
