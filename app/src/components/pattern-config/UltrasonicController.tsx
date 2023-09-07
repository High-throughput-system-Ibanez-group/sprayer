import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { appStore } from "~/stores/app";
import { type DataTypeUltra, Mode } from "~/utils/ultrasonicSensor/functions";

export const UltrasonicController = observer(() => {
  const app = appStore();
  const refPower = React.useRef<HTMLInputElement>(null);

  // const runningPower = app.ultrasonicSensorMode;
  // const standbyPower = app.ultrasonicSensorMode;

  const toggleSwitch = (newMode: Mode) => {
    const data: DataTypeUltra = {
      mode: newMode,
      runningPower:
        newMode === Mode.Running ? refPower.current?.valueAsNumber || 0 : 0,
      standbyPower: 0,
    };

    console.log("mode -> ", newMode === Mode.Running ? "Running" : "Standby");
    console.log("data -> ", data);

    app.socket?.emit("sendDataToRS485", data);

    runInAction(() => {
      app.ultrasonicSensorMode = newMode;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Ultrasonic Controller</div>
      <div className="h-4" />
      <button
        type="button"
        className={
          "rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
        }
        onClick={() => {
          toggleSwitch(Mode.Running);
        }}
      >
        Start
      </button>
      <button
        type="button"
        className={
          "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
        }
        onClick={() => {
          toggleSwitch(Mode.Standby);
        }}
      >
        Stop
      </button>
      <div className="h-4" />
      <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="w-44 font-medium">
          Running Power
        </label>
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
          ref={refPower}
        />
      </div>
    </div>
  );
});
