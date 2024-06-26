import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { steperCommandToString } from "~/lib/setupCommands";
import { type Stepper } from "~/lib/types";
import { appStore } from "~/stores/app";
import { Steppers } from "~/utils/types";
import toast from "react-hot-toast";

export const Settings = observer(() => {
  const app = appStore();

  const handleStepperChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    runInAction(() => {
      app.settingsSelectedStepper = event.target.value as Steppers;
    });
  };

  const getStepper = (selectedStepper: Steppers) => {
    switch (selectedStepper) {
      case Steppers.X:
        return app.stepperX;
      case Steppers.Y:
        return app.stepperY;
      case Steppers.Z:
        return app.stepperZ;
      case Steppers.S:
        return app.stepperS;
    }
  };

  const stepper = getStepper(app.settingsSelectedStepper);

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
          value={app.settingsSelectedStepper}
          onChange={handleStepperChange}
        >
          {Object.values(Steppers).map((stepper) => (
            <option key={stepper} value={stepper}>
              {stepper}
            </option>
          ))}
          {/* <option value={Steppers.X}>x</option>
          <option value={Steppers.Y}>y</option>
          <option value={Steppers.Z}>z</option>
          <option value={Steppers.S}>Syringe</option> */}
        </select>
        <div className="h-4" />
        <Element stepper={stepper} />
      </div>
    </div>
  );
});

const Element = observer(({ stepper }: { stepper: Stepper }) => {
  const app = appStore();
  const stepperName = steperCommandToString(stepper.command);

  const [vel, setVel] = useState(stepper.velocity);
  const [microStepping, setMicroStepping] = useState(stepper.microstepping);

  const handleVelSubmit = () => {
    app.setStepperVelocity(stepper, vel);
    toast.success(`Velocity for ${stepperName} setted to ${vel} mm/s`);
  };

  const handleMicroSteppingSubmit = () => {
    runInAction(() => {
      app.setStepperMicrostepping(stepper, microStepping);
      toast.success(
        `Microstepping for ${stepperName} setted to ${microStepping}`
      );
    });
  };

  useEffect(() => {
    setVel(stepper.velocity);
    setMicroStepping(stepper.microstepping);
  }, [app, stepper]);

  return (
    <>
      <div>Step sleep micros: {stepper.step_sleep_micros}</div>
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
            value={
              vel === 0 ? "" : vel % 1 !== 0 ? Number(vel.toFixed(3)) : vel
            }
            onChange={(e) => {
              if (e.target.value === "") {
                setVel(0);
                return;
              }
              setVel(Number(e.target.valueAsNumber.toFixed(3)));
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
            min={1}
            max={9999999}
            value={microStepping === 0 ? "" : microStepping}
            onChange={(e) => {
              if (e.target.value === "") {
                setMicroStepping(0);
                return;
              }
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
