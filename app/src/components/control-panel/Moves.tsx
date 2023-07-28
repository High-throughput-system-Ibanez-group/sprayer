import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { appStore } from "~/stores/app";
import { type Steppers } from "~/utils/types";

export const Moves = observer(() => {
  const app = appStore();
  const socket = app.socket;

  const refXMm = useRef<HTMLInputElement>(null);
  const refYMm = useRef<HTMLInputElement>(null);
  const refZMm = useRef<HTMLInputElement>(null);
  const refSyringeMm = useRef<HTMLInputElement>(null);

  const onSpecificMove = (steppers: Steppers, isNegative?: boolean) => {
    let value;
    switch (steppers) {
      case "x":
        value = refXMm.current?.value;
        break;
      case "y":
        value = refYMm.current?.value;
        break;
      case "z":
        value = refZMm.current?.value;
        break;
      default:
        console.log("No option selected");
    }
    if (value) {
      socket?.emit(
        "command",
        `mm_${steppers}:${isNegative ? "-" : ""}${value}`
      );
    }
  };

  return (
    <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Moves</div>
      <div className="flex flex-col py-6">
        <div className="h-4" />
        <div className="relative flex items-center space-x-4">
          <label
            htmlFor="number-input"
            className="absolute -left-4 font-medium"
          >
            x:
          </label>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSpecificMove("x", true);
            }}
          >
            -
          </button>
          <div className="relative">
            <input
              type="number"
              id="number-input"
              className="w-16 rounded-md border border-gray-300 px-3 py-2"
              ref={refXMm}
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
              onSpecificMove("x");
            }}
          >
            +
          </button>
        </div>
        <div className="h-4" />
        <div className="relative flex items-center space-x-4">
          <label
            htmlFor="number-input"
            className="absolute -left-4 font-medium"
          >
            y:
          </label>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSpecificMove("y", true);
            }}
          >
            -
          </button>
          <input
            type="number"
            id="number-input"
            className="w-16 rounded-md border border-gray-300 px-3 py-2"
            ref={refYMm}
            min="0"
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSpecificMove("y");
            }}
          >
            +
          </button>
        </div>
        <div className="h-4" />
        <div className="relative flex items-center space-x-4">
          <label
            htmlFor="number-input"
            className="absolute -left-4 font-medium"
          >
            z:
          </label>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSpecificMove("z", true);
            }}
          >
            -
          </button>
          <input
            type="number"
            id="number-input"
            className="w-16 rounded-md border border-gray-300 px-3 py-2"
            ref={refZMm}
            min="0"
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSpecificMove("z");
            }}
          >
            +
          </button>
        </div>
        <div className="h-4" />
        <div className="relative flex items-center space-x-4">
          <label
            htmlFor="number-input"
            className="absolute -left-16 font-medium"
          >
            syringe:
          </label>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSpecificMove("syringe", true);
            }}
          >
            -
          </button>
          <input
            type="number"
            id="number-input"
            className="w-16 rounded-md border border-gray-300 px-3 py-2"
            ref={refSyringeMm}
            min="0"
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSpecificMove("syringe");
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
});
