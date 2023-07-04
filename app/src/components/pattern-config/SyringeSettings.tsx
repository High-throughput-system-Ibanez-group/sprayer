import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { appStore } from "~/stores/app";

export const Settings = observer(() => {
  const app = appStore();
  const socket = app.socket;
  const refInputSharpeningPressure = useRef<HTMLInputElement>(null);

  const [valve, setValve] = useState(false);
  const [pressureInput, setPressureInput] = useState("");

  const onSetSharpeningPressure = () => {
    if (refInputSharpeningPressure.current?.value) {
      socket?.emit(
        "command",
        `set_sharpening_pressure:${refInputSharpeningPressure.current?.value}`
      );
    }
  };

  const onClickSetValve = () => {
    socket?.emit("command", `set_valve:${valve ? "0" : "1"}`);
    setValve(!valve);
  };

  useEffect(() => {
    socket?.on("pressure_input", (data) => {
      console.log("pressure_input_from_board: ", data);
      const dataString = data as string;
      setPressureInput(dataString);
    });
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Syringe Settings</div>
      <div className="flex flex-1 flex-col py-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="number"
              id="number-input"
              min="0"
              className="w-32 rounded-md border border-gray-300 px-3 py-2"
              ref={refInputSharpeningPressure}
              // prevent decimals only integers
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          </div>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              onSetSharpeningPressure();
            }}
          >
            Set sharpening pressure
          </button>
        </div>
        <div className="h-4" />
        <button
          type="button"
          className={
            valve
              ? "rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
              : "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          }
          onClick={() => {
            onClickSetValve();
          }}
        >
          {valve ? "ON" : "OFF"}
        </button>
        <div className="h-4" />
        <div>
          Pressure input:
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            readOnly
            value={pressureInput}
          />
        </div>

        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          Start Pumping
        </button>
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          Stop Pumping
        </button>
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          Recharge Pump
        </button>
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          Inject
        </button>
        <div className="h-4" />
        <div className="flex flex-1 items-center space-x-4">
          <label htmlFor="number-input" className="w-[162px] font-medium">
            Radius syringe:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="h-4" />
        <div className="flex flex-1 items-center space-x-4">
          <label htmlFor="number-input" className="w-[162px] font-medium">
            Flow rate:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="h-4" />
        <div className="flex flex-1 items-center space-x-4">
          <label htmlFor="number-input" className="w-[162px] font-medium">
            Volume:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
});
