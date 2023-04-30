import { observer } from "mobx-react-lite";
import { appStore } from "~/store/app";

export const Zeroing = observer(() => {
  const app = appStore();
  const socket = app.socket;

  const handleZeroingClick = (type: "start" | "end") => {
    console.log("ZeroingClick button clicked");
    socket?.emit("command", `zeroing_${type}`);
  };

  return (
    <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Zeroing</div>
      <div className="flex flex-row py-6">
        <button
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            handleZeroingClick("start");
          }}
        >
          Zeroing start
        </button>
        <div className="w-4" />
        <button
          className="rounded-md bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            handleZeroingClick("end");
          }}
        >
          Zeroing end
        </button>
      </div>
    </div>
  );
});
