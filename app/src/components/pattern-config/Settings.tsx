import { observer } from "mobx-react-lite";

export const Settings = observer(() => {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Settings</div>
      <div className="flex flex-1 flex-col py-6">
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
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="w-[162px] font-medium">
            Number of loops:
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
