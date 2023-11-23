import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

interface Point {
  x: number;
  y: number;
}

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
        }
        context.stroke();
        isMovingRight = !isMovingRight;
      }
    }
  }

  return points;
}

type Patterns = "serpentine";

const DesignPattern = observer(() => {
  const [selectedPattern, setSelectedPattern] = useState<Patterns>();
  const [xAxis, setXAxis] = useState<number>(1000);
  const [yAxis, setYAxis] = useState<number>(1000);
  const canvasWidth = xAxis / 2;
  const canvasHeight = yAxis / 2;

  const [horizontalDistance, setHorizontalDistance] = useState<number>(0);
  const [verticalDistance, setVerticalDistance] = useState<number>(0);
  const canvasHorizontalDistance = horizontalDistance / 4;
  const canvasVerticalDistance = verticalDistance / 2;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const numberOfLoopsRef = useRef<HTMLInputElement>(null);

  const drawPattern = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    // conver joint(-) separated string to array of points
    const points = [] as Point[];
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
  }, []);

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
    const numbersArray = points.map((point) => [point.x, point.y]);
    // savePattern({ areaId, points: numbersArray, patternId: areaPattern?.id });
  };

  return (
    <div className="flex w-full flex-1 flex-row gap-4">
      <div className="flex h-full w-full flex-1 flex-col items-center">
        <div>Area</div>
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
        <div>Pattern</div>
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
            <Button variant="default" onClick={onGenerate}>
              Generate spray pattern
            </Button>
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
