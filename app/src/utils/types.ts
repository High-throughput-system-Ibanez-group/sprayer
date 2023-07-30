export type Axis = "x" | "y" | "z";

// coordinates type
export type Coordinates = {
  x: number;
  y: number;
  z: number;
};

export type Area = {
  id: number;
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
};

export type Steppers = "x" | "y" | "z" | "s";
