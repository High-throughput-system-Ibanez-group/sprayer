import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { steperCommandToString } from "~/lib/setupCommands";
import { type Stepper } from "~/lib/types";
import { appStore } from "~/stores/app";
import { type Steppers } from "~/utils/types";

export const Settings = () => {
  const app = appStore();
  const [selectedStepper, setSelectedStepper] = useState<Steppers>("x");

  const handleStepperChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStepper(event.target.value as Steppers);
  };

  const getStepper = () => {
    switch (selectedStepper) {
      case "x":
        return app.stepperX;
      case "y":
        return app.stepperY;
      case "z":
        return app.stepperZ;
      case "s":
        return app.stepperS;
    }
  };

  return (
    <div className="flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Settings</div>
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
        <Element stepper={getStepper()} />
      </div>
    </div>
  );
};

const Element = observer(({ stepper }: { stepper: Stepper }) => {
  const app = appStore();

  const [vel, setVel] = useState(app.getStepperVelocity(stepper));
  const [microStepping, setMicroStepping] = useState(stepper.microstepping);

  const handleVelSubmit = () => {
    app.setStepperVelocity(stepper, vel);
  };

  const handleMicroSteppingSubmit = () => {
    runInAction(() => {
      stepper.microstepping = microStepping;
      setVel(app.getStepperVelocity(stepper));
    });
  };

  const stepperName = steperCommandToString(stepper.command);

  return (
    <>
      <div className="flex items-center space-x-4 rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
        <label htmlFor="number-input" className="font-medium">
          {stepperName}:
        </label>
        <div className="relative flex flex-col">
          <div>Velocity in mm/s</div>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            value={vel}
            onChange={(e) => {
              setVel(Number(e.target.value));
            }}
          />
        </div>

        <button
          type="button"
          className={
            "rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          }
          onClick={() => {
            handleVelSubmit();
          }}
        >
          Update {stepperName}
        </button>
      </div>
      <div className="h-4" />
      <div className="flex items-center space-x-4 rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
        <label htmlFor="number-input" className="font-medium">
          {stepperName}:
        </label>
        <div className="relative flex flex-col">
          <div>Miscrostepping</div>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            value={microStepping}
            onChange={(e) => {
              setMicroStepping(Number(e.target.value));
            }}
          />
        </div>
        <button
          type="button"
          className={
            "rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          }
          onClick={() => {
            handleMicroSteppingSubmit();
          }}
        >
          Update {stepperName}
        </button>
      </div>
    </>
  );
});
