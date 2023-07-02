import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { appStore } from "~/stores/app";
import { type Axis } from "~/utils/types";

export const Moves = observer(() => {
  const app = appStore();
  const socket = app.socket;

  const refXPos = useRef<HTMLInputElement>(null);
  const refXMove = useRef<HTMLInputElement>(null);
  const refXMm = useRef<HTMLInputElement>(null);

  const refYPos = useRef<HTMLInputElement>(null);
  const refYMove = useRef<HTMLInputElement>(null);
  const refYMm = useRef<HTMLInputElement>(null);

  const refZPos = useRef<HTMLInputElement>(null);
  const refZMove = useRef<HTMLInputElement>(null);
  const refZMm = useRef<HTMLInputElement>(null);

  const onMove = () => {
    if (refXPos.current?.value) {
      // TODO: Pos move
      // TODO: Check command
      socket?.emit("command", `mm_x:${refXPos.current?.value}`);
      // set to 0
      refXPos.current.value = "0";
    }
    if (refYPos.current?.value) {
      socket?.emit("command", `mm_y:${refYPos.current?.value}`);
      // set to 0
      refYPos.current.value = "0";
    }
    if (refZPos.current?.value) {
      socket?.emit("command", `mm_z:${refZPos.current?.value}`);
      // set to 0
      refZPos.current.value = "0";
    }
  };

  const onSpecificMove = (axis: Axis, isNegative?: boolean) => {
    let value;
    switch (axis) {
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
      socket?.emit("command", `mm_${axis}:${isNegative ? "-" : ""}${value}`);
    }
  };

  return (
    <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Moves</div>
      <div className="flex flex-col py-6">
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="font-medium">
            x:
          </label>
          <div className="relative">
            <input
              type="number"
              id="number-input"
              className="w-44 rounded-md border border-gray-300 px-3 py-2"
              ref={refXPos}
            />
            <div className="absolute -top-8 left-0 flex w-full justify-center">
              Absolute Position (mm)
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              id="number-input"
              className="w-44 rounded-md border border-gray-300 px-3 py-2"
              ref={refXMove}
            />
            <div className="absolute -top-8 left-0 flex w-full justify-center">
              Move (mm)
            </div>
          </div>
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
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="font-medium">
            y:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-44 rounded-md border border-gray-300 px-3 py-2"
            ref={refYPos}
          />
          <input
            type="number"
            id="number-input"
            className="w-44 rounded-md border border-gray-300 px-3 py-2"
            ref={refYMove}
          />
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
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="font-medium">
            z:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-44 rounded-md border border-gray-300 px-3 py-2"
            ref={refZPos}
          />
          <input
            type="number"
            id="number-input"
            className="w-44 rounded-md border border-gray-300 px-3 py-2"
            ref={refZMove}
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSpecificMove("z", true);
              //TODO: move x
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
        <div className="h-6" />
        <button
          type="button"
          className="ml-[260px] w-24 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: on movew
            onMove();
          }}
        >
          Move
        </button>
      </div>
    </div>
  );
});
