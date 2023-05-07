import { type Area } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
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

const PatternConfig = () => {
  const { data: fetchedAreas, isLoading } = api.areas.getAll.useQuery();
  const { canvasHeight, canvasWidth, gridSize } = config;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      return;
    }

    // Draw grid lines
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#4287f5";
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
    }
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    // // Draw lines between points
    // ctx.beginPath();
    // for (let i = 0; i < points.length - 1; i++) {
    //   const p1 = points[i];
    //   const p2 = points[i + 1];
    //   p1 && ctx.moveTo(p1.x, p1.y);
    //   p2 && ctx.lineTo(p2.x, p2.y);
    // }
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2;
    // ctx.stroke();
    // Draw lines between points
    ctx.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (!p1 || !p2) return;
      // Use Bresenham's algorithm to generate a list of all the points that the line passes through
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      const sx = p1.x < p2.x ? 1 : -1;
      const sy = p1.y < p2.y ? 1 : -1;
      let x = p1.x;
      let y = p1.y;
      const pointsOnLine: Point[] = [{ x, y }];
      let err = dx - dy;
      while (x !== p2.x || y !== p2.y) {
        const e2 = err * 2;
        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }
        if (e2 < dx) {
          err += dx;
          y += sy;
        }
        pointsOnLine.push({ x, y });
      }

      // Fill the grid points with a color
      for (const { x, y } of pointsOnLine) {
        const gridX = Math.floor(x / gridSize) * gridSize;
        const gridY = Math.floor(y / gridSize) * gridSize;
        ctx.fillRect(gridX + 1, gridY + 1, gridSize - 2, gridSize - 2);
      }

      // Draw the line
      ctx.moveTo(p1.x, p1.y);
      for (const { x, y } of pointsOnLine) {
        ctx.lineTo(x, y);
      }
    }
  }, [canvasWidth, canvasHeight, gridSize, points]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // Get the position of the click relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Round the position to the nearest grid point
    const gridX = Math.floor(x / gridSize) * gridSize;
    const gridY = Math.floor(y / gridSize) * gridSize;

    // Add the point to the list of points
    setPoints([...points, { x: gridX, y: gridY }]);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex h-full flex-1 flex-row">
      <Sidebar areas={fetchedAreas} />
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <h1 className="p-4">Pattern design</h1>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleClick}
          style={{ border: "1px solid black" }}
        />
      </div>
    </div>
  );
};
export default PatternConfig;

const Sidebar = ({ areas }: { areas: Area[] | undefined }) => {
  if (!areas) return null;

  return (
    <div className="flex h-full w-48 flex-col justify-between bg-gray-600 text-white">
      <div className="pl-4 pt-6">
        {areas.map((area, idx) => (
          <button
            key={area.id}
            className="mb-2 block cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
          >
            Sample {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export { Sidebar };
