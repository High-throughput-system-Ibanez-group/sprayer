import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { appStore } from "~/stores/app";
import { type Steppers } from "~/utils/types";

export const Settings = () => {
  const [selectedStepper, setSelectedStepper] = useState<Steppers>("x");

  const handleStepperChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStepper(event.target.value as Steppers);
  };

  const testByteCommand = () => {
    const COMMAND_ZEROING_END = 0x41;
    const app = appStore();
    const socket = app.socket;
    socket?.emit(
      "command",
      [String.fromCharCode(COMMAND_ZEROING_END), 11, 22].join(":")
    );
  };

  return (
    <div className="flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Settings</div>
      <div className="h-4" />
      <button
        type="button"
        className={
          "rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        }
        onClick={() => {
          testByteCommand();
        }}
      >
        Test byte command
      </button>
      <div className="h-4" />
      <div className="flex flex-col py-6">
        <label htmlFor="stepper-select" className="mb-2 text-lg font-medium">
          Select a stepper:
        </label>
        <select
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={selectedStepper}
          onChange={handleStepperChange}
        >
          <option value="x">x</option>
          <option value="y">y</option>
          <option value="z">z</option>
          <option value="s">Syringe</option>
        </select>
        <div className="h-4" />
        <Element stepper={selectedStepper} />
      </div>
    </div>
  );
};

const Element = observer(({ stepper }: { stepper: Steppers }) => {
  const app = appStore();
  const socket = app.socket;

  const refInputVel = useRef<HTMLInputElement>(null);

  const handleStepperSubmit = () => {
    if (!refInputVel.current?.value) return;
    socket?.emit(
      "command",
      `stepper_velocity_${stepper}:${refInputVel.current?.value}`
    );
  };

  return (
    <div className="flex items-center space-x-4 rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <label htmlFor="number-input" className="font-medium">
        {stepper}:
      </label>
      <div className="relative flex flex-col">
        <div>Velocity in mm/s</div>
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
          ref={refInputVel}
        />
      </div>

      <button
        type="button"
        className={
          "rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        }
        onClick={() => {
          handleStepperSubmit();
        }}
      >
        Update {stepper}
      </button>
    </div>
  );
});
