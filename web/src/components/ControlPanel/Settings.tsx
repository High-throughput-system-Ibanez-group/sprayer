import { observer } from "mobx-react-lite";
import { appStore } from "~/store/app";

export const Settings = observer(() => {
  const app = appStore();
  const socket = app.socket;

  const onClickTest = () => {
    console.log("Test button clicked");
    socket?.emit("command", "test");
  };
  return (
    <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Settings</div>
      <div className="flex flex-col py-6">
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={onClickTest}
        >
          Send test
        </button>
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: microstepping
          }}
        >
          Microstepping
        </button>
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            //TODO: nozzle speed
          }}
        >
          Nozzle speed (mm/s)
        </button>
      </div>
    </div>
  );
});
