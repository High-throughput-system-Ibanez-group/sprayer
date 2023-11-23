import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { appStore } from "~/stores/app";
import { api } from "~/utils/api";

interface GridCanvas {
  canvasWidth: number;
  canvasHeight: number;
  gridSize: number;
}

interface Point {
  x: number;
  y: number;
}

const config: GridCanvas = {
  canvasHeight: 500,
  canvasWidth: 500,
  gridSize: 20,
};

function drawSnakePattern(
  context: CanvasRenderingContext2D,
  horizontalDistance: number,
  verticalDistance: number
): Point[] {
  const centerX = config.canvasWidth / 2;
  const centerY = config.canvasHeight / 2;
  const points: Point[] = [];

  // calculate number of rows and columns
  const numRows = Math.floor(config.canvasHeight / verticalDistance);
  const numCols = Math.floor(centerX / horizontalDistance);

  const startX = centerX - ((numCols - 1) * horizontalDistance) / 2;
  const startY = centerY - ((numRows - 1) * verticalDistance) / 2;

  let isMovingRight = true;

  context.lineWidth = 2;
  context.strokeStyle = "black";

  for (let row = 0; row < numRows; row++) {
    // alternate direction of horizontal lines

    for (let col = 0; col < numCols; col++) {
      const x = startX + col * horizontalDistance;
      const y = startY + row * verticalDistance;

      context.beginPath();
      context.moveTo(x - horizontalDistance, y);
      context.lineTo(x + horizontalDistance, y);
      context.stroke();
      points.push({ x: x - horizontalDistance, y });
      // draw vertical line
      if (row !== numRows - 1) {
        context.beginPath();
        if (isMovingRight) {
          context.moveTo(x + horizontalDistance, y);
          points.push({ x: x + horizontalDistance, y });
          context.lineTo(x + horizontalDistance, y + verticalDistance);
          points.push({ x: x + horizontalDistance, y: y + verticalDistance });
        } else {
          context.moveTo(x - horizontalDistance, y);
          points.push({ x: x - horizontalDistance, y });
          context.lineTo(x - horizontalDistance, y + verticalDistance);
        }
        context.stroke();
        isMovingRight = !isMovingRight;
      }
    }
  }

  return points;
}

type ActiveButtonType = 0 | 1 | 2; // 0 -> 1, 1 -> 0.5, 2 -> 0.25

const activeButtonToValue = (activeButton: ActiveButtonType) => {
  switch (activeButton) {
    case 0:
      return 1;
    case 1:
      return 0.5;
    case 2:
      return 0.25;
  }
};

const PatternArea = observer(({ areaId }: { areaId: number }) => {
  const app = appStore();
  const socket = app.socket;

  const { canvasHeight, canvasWidth } = config;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeButton, setActiveButton] = useState<ActiveButtonType>(0);

  const numberOfLoopsRef = useRef<HTMLInputElement>(null);

  const [horizontalDistance, setHorizontalDistance] = useState<number>();
  const [verticalDistance, setVerticalDistance] = useState<number>();

  const handleButtonClick = (buttonName: ActiveButtonType) => {
    setActiveButton(buttonName);
  };

  const onStartExperiment = () => {
    const numberOfLoops = numberOfLoopsRef.current?.valueAsNumber;
    if (numberOfLoops) {
      socket?.emit("command", `pattern:${numberOfLoops}:${activeButton}`);
    }
  };

  const onStopExperiment = () => {
    socket?.emit("command", "pattern_stop");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
        <div className="mb-2 text-xl font-bold">Experiment Settings</div>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="w-44 font-medium">
            Number of loops:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            ref={numberOfLoopsRef}
            min="0"
          />
        </div>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
          <span>mm/min</span>
          <button
            type="button"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Set motor speed
          </button>
        </div>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="w-44 font-medium">
            Time required:
          </label>
          {"NaN"}
          <span>min</span>
        </div>{" "}
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="w-44 font-medium">
            Ink volume required:
          </label>
          {"NaN"}
          <span>ml</span>
        </div>
        <div className="h-4" />
        <div className="flex overflow-hidden rounded-md">
          <button
            className={`btn flex-1 ${
              activeButton === 0
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick(0)}
          >
            {activeButtonToValue(0)}
          </button>
          <button
            className={`btn flex-1 ${
              activeButton === 1
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick(1)}
          >
            {activeButtonToValue(1)}
          </button>
          <button
            className={`btn flex-1 ${
              activeButton === 2
                ? "bg-blue-500 px-4 py-2 text-white"
                : "bg-gray-200 px-4 py-2 text-gray-700 hover:bg-blue-300 hover:text-white focus:outline-none"
            }`}
            onClick={() => handleButtonClick(2)}
          >
            {activeButtonToValue(2)}
          </button>
        </div>
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={onStartExperiment}
        >
          Start experiment
        </button>{" "}
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          onClick={onStopExperiment}
        >
          Stop experiment
        </button>
      </div>
    </>
  );
});

export { PatternArea };
