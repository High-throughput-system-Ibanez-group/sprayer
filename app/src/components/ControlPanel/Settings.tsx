import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { appStore } from "~/stores/app";

export const Settings = observer(() => {
  const app = appStore();
  const socket = app.socket;

  const refMicro = useRef<HTMLInputElement>(null);
  const refNs = useRef<HTMLInputElement>(null);

  const onClickTest = () => {
    console.log("Test button clicked");
    socket?.emit("command", "test");
  };

  const handleMicro = () => {
    if (refMicro.current?.value) {
      socket?.emit("command", `microstepping:${refMicro.current?.value}`);
    }
  };

  const handleNs = () => {
    if (refNs.current?.value) {
      socket?.emit("command", `ns:${refNs.current?.value}`);
    }
  };

  return (
    <div className="flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Settings</div>
      <div className="flex flex-1 flex-col py-6">
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={onClickTest}
        >
          Send test
        </button>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="w-[162px] font-medium">
            Microstepping:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            ref={refMicro}
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              handleMicro();
            }}
          >
            Update
          </button>
        </div>
        <div className="h-4" />
        <div className="flex flex-1 items-center space-x-4">
          <label htmlFor="number-input" className="font-medium">
            Nozzle speed (mm/s):
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            ref={refNs}
          />
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            onClick={() => {
              handleNs();
            }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
});
