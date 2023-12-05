export enum Step {
  COUNT_STEPS_X = 0,
  COUNT_STEPS_X_OFF = 1,
  COUNT_STEPS_Y = 2,
  COUNT_STEPS_Y_OFF = 3,
  COUNT_STEPS_Z = 4,
  COUNT_STEPS_Z_OFF = 5,
  DISABLE_STEPPERS = 6,
  GET_STEPPER_STEPS_X = 7,
  GET_STEPPER_STEPS_Y = 8,
  GET_STEPPER_STEPS_Z = 9,
  SET_VALVE_1_OFF = 10,
  SET_VALVE_1_ON = 11,
  SET_VALVE_2_OFF = 12,
  SET_VALVE_2_ON = 13,
  STOP_MOTORS = 14,
  ZEROING_END = 15,
  ZEROING_END_S = 16,
  ZEROING_END_X = 17,
  ZEROING_END_Y = 18,
  ZEROING_END_Z = 19,
  ZEROING_START = 20,
  ZEROING_START_S = 21,
  ZEROING_START_X = 22,
  ZEROING_START_Y = 23,
  ZEROING_START_Z = 24,
  MOVE_X_MM = 25,
  MOVE_Y_MM = 26,
  MOVE_Z_MM = 27,
  SLEEP_MS = 28,
  ULTRASONIC_ON = 29,
  STOP_S = 30,
}

export type StepType = Step | [Step, number] | StepType[];

export const SATAND_BY_MOTORS_SEQUENCE: Step[] = [
  Step.ZEROING_START,
  Step.DISABLE_STEPPERS,
];

export const WORKING_SPACE_X_SEQUENCE: Step[] = [
  Step.ZEROING_START_X,
  Step.COUNT_STEPS_X,
  Step.ZEROING_END_X,
  Step.COUNT_STEPS_X_OFF,
  Step.GET_STEPPER_STEPS_X,
];

export const WORKING_SPACE_Y_SEQUENCE: Step[] = [
  Step.ZEROING_START_Y,
  Step.COUNT_STEPS_Y,
  Step.ZEROING_END_Y,
  Step.COUNT_STEPS_Y_OFF,
  Step.GET_STEPPER_STEPS_Y,
];

export const WORKING_SPACE_Z_SEQUENCE: Step[] = [
  Step.ZEROING_START_Z,
  Step.COUNT_STEPS_Z,
  Step.ZEROING_END_Z,
  Step.COUNT_STEPS_Z_OFF,
  Step.GET_STEPPER_STEPS_Z,
];

export const CLEAN_SEQUENCE: Step[] = [
  Step.SET_VALVE_1_ON,
  Step.ZEROING_END_S,
  Step.SET_VALVE_1_OFF,
  Step.ZEROING_START_S,
];

// export const serpentineSequence = (
//   points: [],
//   xAxis: number,
//   yAxis: number,
//   numberOfReps: number
// ): StepType[] => {
//   const INITIAL_STEPS = [
//     Step.ZEROING_START,
//     [
//       [Step.MOVE_X_MM, 70],
//       [Step.MOVE_Y_MM, 70],
//     ],
//     Step.ULTRASONIC_ON,
//     [Step.SLEEP_MS, 500],
//   ];

//   const patternSteps = points.map((point: Point) => {
//     return [
//       [Step.MOVE_X_MM, point.x],
//       [Step.MOVE_Y_MM, point.y],
//     ];
//   });

//   const LOOP_STEPS = [
//     Step.SET_VALVE_2_ON,
//     Step.ZEROING_END_S,
//     [
//       [Step.MOVE_X_MM, 100],
//       [Step.MOVE_Y_MM, 100],
//     ],
//     ...patternSteps,
//     Step.SET_VALVE_2_OFF,
//     Step.STOP_S,
//     [
//       [Step.MOVE_X_MM, -xAxis],
//       [Step.MOVE_Y_MM, -yAxis],
//     ],
//   ];

//   const finalSteps = [...INITIAL_STEPS, Array(numberOfReps).fill(LOOP_STEPS)];
//   return INITIAL_STEPS;
//   // return finalSteps
// };
