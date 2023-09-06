import { observer } from "mobx-react-lite";
import React from "react";
import { CLEAN_SEQUENCE } from "~/lib/sequences";
import { appStore } from "~/stores/app";

export const Cleaning = observer(() => {
  const { executeSequenceLoop } = appStore();

  const cleaningRepetitionsRef = React.useRef<HTMLInputElement>(null);

  const onClean = async () => {
    const cleaningRepetitions = cleaningRepetitionsRef.current?.valueAsNumber;
    if (cleaningRepetitions) {
      await executeSequenceLoop(CLEAN_SEQUENCE, cleaningRepetitions);
    }
  };

  // TODO: Stop / Resume

  // const onStop = () => {
  //   socket?.emit("command", "stop_clean");
  // };

  // const onResume = () => {
  //   socket?.emit("command", "resume_clean");
  // };

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
      <div className="mb-2 text-xl font-bold">Clean system</div>
      <div className="h-4" />
      <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="w-44 font-medium">
          Number of cleaning repetitions:
        </label>
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
          ref={cleaningRepetitionsRef}
        />
      </div>
      {/* <div className="h-4" /> */}
      {/* <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="w-44 font-medium">
          Ultrasonic generator syringe power:
        </label>
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
          // value={horizontalDistance}
          // onChange={(e) => setHorizontalDistance(Number(e.target.value))}
        />
      </div> */}
      {/* <div className="h-4" />
      <div className="flex items-center space-x-4">
        <label htmlFor="number-input" className="w-44 font-medium">
          Ultrasonic generator syringe time (seconds):
        </label>
        <input
          type="number"
          id="number-input"
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
          // value={verticalDistance}
          // onChange={(e) => setVerticalDistance(Number(e.target.value))}
        />
      </div> */}
      <div className="h-4" />
      <button
        type="button"
        className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        onClick={() => {
          void onClean();
        }}
      >
        Clean
      </button>
      {/* <div className="h-4" />
      <button
        type="button"
        className="rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
        onClick={onStop}
      >
        Stop clean sequence
      </button>
      <div className="h-4" />
      <button
        type="button"
        className="rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
        onClick={onResume}
      >
        Resume clean sequence
      </button> */}
    </div>
  );
});
