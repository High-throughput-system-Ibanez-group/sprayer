import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { appStore } from "~/stores/app";

export const Settings = observer(() => {
  const app = appStore();
  const socket = app.socket;
  const refInputSharpeningPressure = useRef<HTMLInputElement>(null);

  const [valve, setValve] = useState(false);
  const [pressureInput, setPressureInput] = useState("");
  const [sharpeningPressure, setSharpeningPressure] = useState(0.07);

  const [activeButton, setActiveButton] = useState("");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const onStopPump = () => {
    // socket?.emit("command", "stop_pumping");
  };

  const wrongPressure = (pressure: number) => {
    return pressure < 0.005 || pressure > 1;
  };

  const onSetSharpeningPressure = () => {
    const pressure = refInputSharpeningPressure.current?.valueAsNumber;
    if (pressure && !wrongPressure(pressure)) {
      const value = Math.round((pressure - 0.005) * (255 / (1 - 0.005)));
      socket?.emit("command", `set_sharpening_pressure:${value}`);
    }
  };

  const onClickSetValve = () => {
    socket?.emit("command", `set_solenoid_valve_syringe:${valve ? "0" : "1"}`);
    setValve(!valve);
  };

  useEffect(() => {
    socket?.on("pressure_regulator_in", (data: string) => {
      const value = parseInt(data);
      // convert value from 0 to 1023 to pressure from 0.005 to 1
      const pressure = (value / 1023) * (1 - 0.005) + 0.005;
      // const pressure = ((value / 255) * (1 - 0.005)) + 0.005;
      // three decimals max
      setPressureInput(pressure.toFixed(3).toString());
    });

    socket?.on("solenoid_valve_syringe", (data) => {
      const dataString = data as string;

      setValve(dataString === "1" ? true : false);
    });
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Spray Settings</div>
      <div className="flex flex-1 flex-col py-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="number"
              step="0.005"
              min="0.005"
              max="1"
              className="w-32 rounded-md border border-gray-300 px-3 py-2"
              ref={refInputSharpeningPressure}
              value={sharpeningPressure}
              onChange={(e) => {
                setSharpeningPressure(e.target.valueAsNumber);
              }}
            />
          </div>
          <span>Bar</span>
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
        {wrongPressure(sharpeningPressure) && (
          <div className="text-red-400">
            Wrong pressure, please enter a value between 0.005 and 1 Bar
          </div>
        )}

        <div className="text-gray-400">
          {"Recommended pressure between 0.06 to 0.5 Bar"}
        </div>
        <div className="h-4" />
        <button
          type="button"
          className={
            valve
              ? "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
              : "rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
          }
          onClick={() => {
            onClickSetValve();
          }}
        >
          {valve ? "Activate Spray channel" : "Recharge/Activate Flush channel"}
        </button>
        <div className="h-4" />
        <div>Pressure reading: {pressureInput ? pressureInput : "NaN"} Bar</div>

        <div className="h-4" />
        <button
          type="button"
          className={
            "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          }
          onClick={onStopPump}
        >
          Stop Pump
        </button>
        <div className="h-4" />
        <div className="flex overflow-hidden rounded-md">
          <button
            className={`btn flex-1 ${
              activeButton === "Recharge Pump"
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick("Recharge Pump")}
          >
            Recharge Pump
          </button>
          <button
            className={`btn flex-1 ${
              activeButton === "Spray"
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick("Spray")}
          >
            Spray
          </button>
          <button
            className={`btn flex-1 ${
              activeButton === "Flux nozzle"
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick("Flux nozzle")}
          >
            Flux nozzle
          </button>
        </div>
        <div className="h-4" />
        <div className="flex flex-1 items-center space-x-4">
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
          <span>mm</span>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Set Radius syringe
          </button>
        </div>
        <div className="h-4" />
        <div className="flex flex-1 items-center space-x-4">
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
          <span>ml/min</span>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Set Flow rate
          </button>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
});
