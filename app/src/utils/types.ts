export type Axis = "x" | "y" | "z";

// coordinates type
export type Coordinates = {
  x: number;
  y: number;
  z: number;
};

export type Area = {
  startingPoint: Coordinates;
  endingPoint: Coordinates;
};
