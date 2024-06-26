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

export enum Steppers {
  X = "x",
  Y = "y",
  Z = "z",
  S = "s",
}
