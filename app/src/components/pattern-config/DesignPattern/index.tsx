import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Point } from "@/lib/types";
import { appStore } from "@/stores/app";

function drawSnakePattern(
  context: CanvasRenderingContext2D,
  horizontalDistance: number,
  verticalDistance: number,
  canvasWidth: number,
  canvasHeight: number
): Point[] {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const points: Point[] = [];

  // calculate number of rows and columns
  const numRows = Math.floor(canvasHeight / verticalDistance);
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
          points.push({ x: x - horizontalDistance, y: y + verticalDistance });
        }
        context.stroke();
        isMovingRight = !isMovingRight;
      }
      if (row === numRows - 1) {
        points.push({ x: x + horizontalDistance, y });
      }
    }
  }

  // return potins without duplicaties
  return points.filter(
    (point, index, self) =>
      index === self.findIndex((p) => p.x === point.x && p.y === point.y)
  );
}

type Patterns = "serpentine";

const SCALE = 32;
// const HORITZONTAL_SCALE = 32 * 2;
const DesignPattern = observer(() => {
  const app = appStore();
  const [selectedPattern, setSelectedPattern] = useState<Patterns>();
  const [xAxis, setXAxis] = useState(10);
  const [yAxis, setYAxis] = useState(10);
  const [running, setRunning] = useState(false);
  const canvasWidth = xAxis * SCALE;
  const canvasHeight = yAxis * SCALE;

  const [points, setPoints] = useState<Point[]>([]);

  const [horizontalDistance, setHorizontalDistance] = useState(10);
  const [verticalDistance, setVerticalDistance] = useState(0);
  const [numberOfLoops, setNumberOfLoops] = useState(1);
  const canvasHorizontalDistance = (horizontalDistance * SCALE) / 2;
  const canvasVerticalDistance = verticalDistance * SCALE;

  useEffect(() => {
    setHorizontalDistance(xAxis);
  }, [xAxis]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const numberOfLoopsRef = useRef<HTMLInputElement>(null);

  // const drawPattern = useCallback(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext("2d");
  //   const points = [] as Point[];
  //   if (!points || !ctx) return;
  //   const firstPoint = points[0];
  //   if (!firstPoint) return;

  //   // draw lines between points
  //   ctx.lineWidth = 2;
  //   ctx.strokeStyle = "black";
  //   for (let i = 0; i < points.length - 1; i++) {
  //     const point = points[i];
  //     const nextPoint = points[i + 1];
  //     if (!point || !nextPoint) return;
  //     ctx.beginPath();
  //     ctx.moveTo(point.x, point.y);
  //     ctx.lineTo(nextPoint.x, nextPoint.y);
  //     ctx.stroke();
  //   }
  // }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }
    // Fill blank every time
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw a rectangle that covers the entire canvas
    // if (areaPattern?.points) {
    //   drawPattern();
    // }
    if (!canvasHorizontalDistance || !canvasVerticalDistance) return;
  }, [
    canvasHorizontalDistance,
    canvasVerticalDistance,
    // areaPattern,
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
      !canvasHorizontalDistance ||
      !canvasVerticalDistance ||
      canvasHorizontalDistance > canvasWidth ||
      canvasVerticalDistance > canvasHeight
    )
      return;
    const points = drawSnakePattern(
      ctx,
      canvasHorizontalDistance,
      canvasVerticalDistance,
      canvasWidth,
      canvasHeight
    );
    // const numbersArray = points.map((point) => [point.x, point.y]);
    // convert to mm
    const numbersArray = points.map((point) => ({
      x: point.x / SCALE,
      y: point.y / SCALE,
    }));
    setPoints(numbersArray);
    // savePattern({ areaId, points: numbersArray, patternId: areaPattern?.id });
  };

  const onRunPattern = async () => {
    try {
      setRunning(true);
      await app.patternSequence(points, numberOfLoops, xAxis, yAxis);
    } catch (e) {
      console.log(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-row gap-4">
      <div className="flex h-full w-full flex-1 flex-col items-center">
        <div>Area (mm)</div>
        <div className="h-4" />
        <div className="flex flex-1 flex-row">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="x">X Axis</Label>
            <Input
              type="number"
              id="number-input"
              value={xAxis}
              onChange={(e) => setXAxis(Number(e.target.value))}
              placeholder="X Axis"
            />
          </div>
          <div className="w-4" />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="x">Y Axis</Label>
            <Input
              type="number"
              id="number-input"
              value={yAxis}
              onChange={(e) => setYAxis(Number(e.target.value))}
              placeholder="Y Axis"
            />
          </div>
        </div>
        <div className="h-8" />
        <div>Pattern (mm)</div>
        <div className="h-4" />
        <Select
          value={selectedPattern}
          onValueChange={(val) => {
            setSelectedPattern(val as Patterns);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Patterns</SelectLabel>
              <SelectItem value="serpentine">Serpentine</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="h-4" />
        {selectedPattern === "serpentine" && (
          <>
            <div className="flex flex-1 flex-row">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="x">Horizontal distance</Label>
                <Input
                  disabled
                  type="number"
                  id="number-input"
                  value={horizontalDistance}
                  onChange={(e) =>
                    setHorizontalDistance(Number(e.target.value))
                  }
                  placeholder="Horizontal distance"
                />
              </div>
              <div className="w-4" />
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="x">Vertical distance</Label>
                <Input
                  type="number"
                  id="number-input"
                  value={verticalDistance}
                  onChange={(e) => setVerticalDistance(Number(e.target.value))}
                  placeholder="Vertical distance"
                />
              </div>
            </div>
            <div className="h-4" />
            <div className="grid w-full max-w-xs items-center gap-1.5">
              <Label htmlFor="x">Number of loops</Label>
              <Input
                type="number"
                id="number-input"
                value={numberOfLoops}
                onChange={(e) => setNumberOfLoops(Number(e.target.value))}
                placeholder="Number of loops"
              />
            </div>
            <div className="h-4" />
            <Button variant="default" onClick={onGenerate}>
              Generate spray pattern
            </Button>
            <div className="h-4" />
            {!!points.length && (
              <Button
                variant="secondary"
                onClick={() => {
                  void onRunPattern();
                }}
                disabled={running}
              >
                Execute pattern {running && "(Running)"}
              </Button>
            )}
            <div className="h-4" />
            <Logs />
          </>
        )}
      </div>
      <div className="w-[1px] bg-slate-300" />
      <div className="flex h-full w-full flex-1 justify-center overflow-scroll">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "1px solid black" }}
        />
      </div>
    </div>
  );
});

export { DesignPattern };

const Logs = observer(() => {
  const app = appStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, [app.logs]);

  if (!app.logs.length) return null;

  return (
    <div
      className="coding inverse-toggle max-h-24 w-96 overflow-scroll rounded-lg bg-gray-800 px-5 pb-6 pt-4 
              font-mono  text-sm leading-normal text-gray-100 subpixel-antialiased shadow-lg"
      ref={ref}
    >
      <div className="mt-4 flex flex-col">
        {app.logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
});
