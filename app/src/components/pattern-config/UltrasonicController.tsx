import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { appStore } from "~/stores/app";
import { type DataTypeUltra, Mode } from "~/utils/ultrasonicSensor/functions";

export const UltrasonicController = observer(() => {
  const app = appStore();
  const mode = app.ultrasonicSensorMode;

  const toggleSwitch = () => {
    const newMode = Mode.Running ? Mode.Standby : Mode.Running;
    const newRunningPower = newMode === Mode.Running ? 100 : 0;
    const newStandbyPower = newMode === Mode.Standby ? 10 : 0;

    const data: DataTypeUltra = {
      mode: Mode.Running,
      runningPower: newRunningPower,
      standbyPower: newStandbyPower,
    };

    app.socket?.emit("sendDataToRS485", data);

    runInAction(() => {
      app.ultrasonicSensorMode = newMode;
    });
  };

  const modeLabel = mode === Mode.Running ? "Stop" : "Start";

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Ultrasonic Controller</div>
      <div className="h-4" />
      <button
        type="button"
        className={
          mode === Mode.Standby
            ? "rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
            : "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
        }
        onClick={() => {
          toggleSwitch();
        }}
      >
        {modeLabel}
      </button>
      <div className="h-4" />
      {/* <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="w-44 font-medium">
          Power (0-100)
        </label>
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
          // ref={cleaningRepetitionsRef}
        />
      </div>
      <div className="h-4" /> */}
      {/* <button
        type="button"
        className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        onClick={() => {
          // TODO: Set power
        }}
      >
        Set Power
      </button> */}
    </div>
  );
});
