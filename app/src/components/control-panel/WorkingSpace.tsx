import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { appStore } from "~/stores/app";
import { type Axis } from "~/utils/types";

export const WorkingSpace = observer(() => {
  const app = appStore();
  const socket = app.socket;
  const refInputX = useRef<HTMLInputElement>(null);
  const refInputY = useRef<HTMLInputElement>(null);
  const refInputZ = useRef<HTMLInputElement>(null);

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

  const handleStepperSubmit = (stepperAxis: Axis) => {
    setState((prev) => ({
      ...prev,
      [stepperAxis]: {
        ...prev.x,
        loading: true,
      },
    }));
    socket?.emit("command", `wspace_${stepperAxis}`);
  };

  socket?.on("wspace_x", (data: string) => {
    setState((prev) => ({
      ...prev,
      x: {
        ...prev.x,
        loading: false,
        value: data,
      },
    }));
  });

  socket?.on("wspace_y", (data: string) => {
    setState((prev) => ({
      ...prev,
      y: {
        ...prev.y,
        loading: false,
        value: data,
      },
    }));
  });

  socket?.on("wspace_z", (data: string) => {
    setState((prev) => ({
      ...prev,
      z: {
        ...prev.z,
        loading: false,
        value: data,
      },
    }));
  });

  // const updateAll = () => {
  //   if (refInputX.current?.value) {
  //     socket?.emit("command", `stepper_x:${refInputX.current?.value}`);
  //   }
  //   if (refInputY.current?.value) {
  //     socket?.emit("command", `stepper_y:${refInputY.current?.value}`);
  //   }
  //   if (refInputZ.current?.value) {
  //     socket?.emit("command", `stepper_z:${refInputZ.current?.value}`);
  //   }
  // };

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
              handleStepperSubmit("x");
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
            ref={refInputY}
            value={state.y.value}
            readOnly
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              handleStepperSubmit("y");
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
            ref={refInputZ}
            value={state.z.value}
            readOnly
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              handleStepperSubmit("z");
            }}
          >
            {state.z.loading ? "Loading.." : "Update z"}
          </button>
        </div>
        {/* <div className="h-6" /> */}
        {/* <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={updateAll}
        >
          Update all
        </button> */}
      </div>
    </div>
  );
});
