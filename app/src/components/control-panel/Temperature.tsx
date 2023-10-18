import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { appStore } from "~/stores/app";

export const Temperature = observer(() => {
  const inputTempRef = useRef<HTMLInputElement>(null);

  const app = appStore();

  return (
    <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Temperature</div>
      <div className="h-4" />
      <div className="flex flex-col">
        {/* readonly input to show the received temperature in ºC */}
        <input
          type="number"
          className="rounded-md bg-gray-100 px-4 py-2 font-medium text-black hover:bg-gray-200"
          readOnly
          value={app.temperatureRead.toFixed(2)}
        />
        <div className="h-4" />
        {/* input and a button in the same row to set a given temperature */}
        <div className="flex flex-row">
          <input
            type="number"
            className="rounded-md bg-gray-100 px-4 py-2 font-medium text-black hover:bg-gray-200"
            placeholder="ºC"
            ref={inputTempRef}
          />
          <div className="w-4" />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              runInAction(() => {
                app.temperatureInput = inputTempRef.current?.valueAsNumber || 0;
              });
            }}
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
});
