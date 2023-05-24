import React, { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { Settings } from "./SyringeSettings";

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

const PatternArea = ({ areaId }: { areaId: number }) => {
  const { canvasHeight, canvasWidth } = config;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [horizontalDistance, setHorizontalDistance] = useState<number>();
  const [verticalDistance, setVerticalDistance] = useState<number>();
  const { data: areaPattern } = api.areas.getAreaPattern.useQuery(areaId);
  const utils = api.useContext();
  const { mutate: savePattern } = api.areas.savePattern.useMutation({
    onSuccess: async () => {
      await utils.areas.getAreaPattern.invalidate();
    },
  });

  const drawPattern = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    // conver joint(-) separated string to array of points
    const points = areaPattern?.points.split("-").map((point) => {
      const [x, y] = point.split(",");
      return { x: Number(x), y: Number(y) };
    });
    if (!points || !ctx) return;
    const firstPoint = points[0];
    if (!firstPoint) return;
    // // Connect the points with lines
    // ctx.beginPath();
    // ctx.moveTo(firstPoint.x, firstPoint.y);

    // for (let i = 1; i < points.length; i++) {
    //   const point = points[i];
    //   if (!point) return;
    //   ctx.lineTo(point.x, point.y);
    // }

    // ctx.stroke();

    // draw lines between points
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];
      if (!point || !nextPoint) return;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();
    }
  }, [areaPattern?.points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }
    // Fill blank every time
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw a rectangle that covers the entire canvas
    if (areaPattern?.points) {
      drawPattern();
    }
    if (!horizontalDistance || !verticalDistance) return;
  }, [
    canvasWidth,
    canvasHeight,
    horizontalDistance,
    verticalDistance,
    areaPattern,
    drawPattern,
  ]);

  const onGenerate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }
    // Fill blank every time
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw a rectangle that covers the entire canvas

    if (
      !horizontalDistance ||
      !verticalDistance ||
      horizontalDistance > canvasWidth ||
      verticalDistance > canvasHeight
    )
      return;
    const points = drawSnakePattern(ctx, horizontalDistance, verticalDistance);
    const numbersArray = points.map((point) => [point.x, point.y]);
    savePattern({ areaId, points: numbersArray, patternId: areaPattern?.id });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-start p-8">
      <Settings />
      <div className="h-8" />
      <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-solid border-gray-200 px-6 py-4">
        <div className="mb-2 text-xl font-bold">Pattern Settings</div>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="w-44 font-medium">
            Number of loops:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="w-44 font-medium">
            Horizontal distance:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            value={horizontalDistance}
            onChange={(e) => setHorizontalDistance(Number(e.target.value))}
          />
        </div>
        <div className="h-4" />
        <div className="flex items-center space-x-4">
          <label htmlFor="number-input" className="w-44 font-medium">
            Vertical distance:
          </label>
          <input
            type="number"
            id="number-input"
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            value={verticalDistance}
            onChange={(e) => setVerticalDistance(Number(e.target.value))}
          />
        </div>
        <div className="h-4" />
        <button
          type="button"
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={onGenerate}
        >
          Generate
        </button>
      </div>
      <>
        <h1 className="p-4">Pattern</h1>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "1px solid black" }}
        />
      </>
    </div>
  );
};

export { PatternArea };
