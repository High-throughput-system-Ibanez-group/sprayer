import { observer } from "mobx-react-lite";
import { SATAND_BY_MOTORS_SEQUENCE, Step } from "~/lib/sequences";
import { appStore } from "~/stores/app";

export const Zeroing = observer(() => {
  const { handleSequenceStep, executeCommandSequence } = appStore();

  const handleZeroingClick = async (type: "start" | "end") => {
    switch (type) {
      case "start":
        await handleSequenceStep(Step.ZEROING_START);
        break;
      case "end":
        await handleSequenceStep(Step.ZEROING_END);
        break;
    }
  };

  const standbyMotors = async () => {
    await executeCommandSequence(SATAND_BY_MOTORS_SEQUENCE);
  };

  const onStopMotors = async () => {
    await handleSequenceStep(Step.STOP_MOTORS);
  };

  return (
    <div className=" border- flex w-[650px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Zeroing</div>
      <div className="h-4" />
      <div className="flex flex-row">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            void handleZeroingClick("start");
          }}
        >
          Zeroing start
        </button>
        <div className="w-4" />
        <button
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            void handleZeroingClick("end");
          }}
        >
          Zeroing end
        </button>
      </div>
      <div className="h-4" />
      <button
        type="button"
        className={
          "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
        }
        onClick={void standbyMotors}
      >
        Stand-By Motors
      </button>
      <div className="h-4" />
      <button
        type="button"
        className={
          "rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
        }
        onClick={void onStopMotors}
      >
        Stop motors
      </button>
    </div>
  );
});
