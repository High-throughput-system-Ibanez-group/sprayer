import { makeAutoObservable, runInAction } from "mobx";
import createSingleton from "~/stores/utils/createSingleton";
import { io, type Socket } from "socket.io-client";
import { executeCommand } from "~/lib/commandExecutionManager";
import {
  getPressureCommand,
  getStepperStepsCommand,
  setPressureCommand,
  setValve2Command,
  stepperCountSteps,
  stepperDisable,
  stepperStop,
  stepperZeroingEnd,
  stepperZeroingStart,
  setValve1Command,
} from "~/lib/setupCommands";
import {
  defStepperX,
  defStepperY,
  defStepperZ,
  defStepperS,
} from "~/lib/defaults";
import { VALVE_STATE, type Stepper, COUNT_STEPS } from "~/lib/types";
import { Step } from "~/lib/sequences";
import { Steppers } from "~/utils/types";
import { Mode } from "~/utils/ultrasonicSensor/functions";

class AppStore {
  socket: Socket | undefined = undefined;
  stepperX: Stepper = defStepperX;
  stepperY: Stepper = defStepperY;
  stepperZ: Stepper = defStepperZ;
  stepperS: Stepper = defStepperS;
  isPressureIntervalActive = false;
  settingsSelectedStepper: Steppers = Steppers.X;
  ultrasonicSensorMode: Mode = Mode.Standby;
  ultrasonicSensorRunningPower = 0;
  ultrasonicSensorStandByPower = 0;

  constructor() {
    makeAutoObservable(this);
    void this.startSocket();
  }

  startSocket = async () => {
    try {
      await fetch("/api/socket");
      runInAction(() => {
        this.socket = io();
        this.socket.on("connect", () => {
          console.log("connected");
        });
      });
    } catch (e) {
      console.log("error: ", e);
    }
  };

  executeCommand = (command: string) => {
    if (!this.socket) return;
    return executeCommand(this.socket, command);
  };

  executeCommandSequence = async (sequence: Step[]) => {
    let res;
    if (!this.socket) return;
    for (const step of sequence) {
      res = await this.handleSequenceStep(step);
    }
    return res;
  };

  executeSequenceLoop = async (sequence: Step[], reps: number) => {
    for (let i = 0; i < reps; i++) {
      await this.executeCommandSequence(sequence);
    }
  };

  stepperStartS = () => {
    return this.executeCommand(stepperZeroingStart(this.stepperS));
  };

  stepperEndS = () => {
    return this.executeCommand(stepperZeroingEnd(this.stepperS));
  };

  executeStepperOperation = (
    steppers: Stepper[],
    operation: (stepper: Stepper) => string
  ) => {
    const commands = steppers.map((stepper) => operation(stepper));
    return Promise.all(commands.map((command) => this.executeCommand(command)));
  };

  get steppers() {
    return [this.stepperX, this.stepperY, this.stepperZ];
  }

  zeroingStart = (stepper?: Stepper) => {
    if (!stepper) {
      return this.executeStepperOperation(this.steppers, stepperZeroingStart);
    }
    return this.executeCommand(stepperZeroingStart(stepper));
  };

  zeroingEnd = (stepper?: Stepper) => {
    if (!stepper) {
      return this.executeStepperOperation(this.steppers, stepperZeroingEnd);
    }
    return this.executeCommand(stepperZeroingEnd(stepper));
  };

  disableSteppers = () => {
    return this.executeStepperOperation(this.steppers, stepperDisable);
  };

  stopMotors = () => {
    return this.executeStepperOperation(this.steppers, stepperStop);
  };

  stepperStopS = () => {
    return this.executeCommand(stepperStop(this.stepperS));
  };

  countSteps = (stepper: Stepper) => {
    return this.executeCommand(stepperCountSteps(stepper));
  };

  getStepperSteps = (stepper: Stepper) => {
    return this.executeCommand(getStepperStepsCommand(stepper));
  };

  getPressure = async () => {
    const data = (await this.executeCommand(
      getPressureCommand()
    )) as unknown as string;
    const value = parseInt(data);
    // convert value from 0 to 1023 to pressure from 0.005 to 1
    const pressure = (value / 1023) * (1 - 0.005) + 0.005;
    // const pressure = ((value / 255) * (1 - 0.005)) + 0.005;
    // three decimals max
    return pressure.toFixed(3).toString();
  };

  handleSequenceStep = (step: Step) => {
    switch (step) {
      case Step.ZEROING_START:
        return this.zeroingStart();
      case Step.ZEROING_START_X:
        return this.zeroingStart(this.stepperX);
      case Step.ZEROING_START_Y:
        return this.zeroingStart(this.stepperY);
      case Step.ZEROING_START_Z:
        return this.zeroingStart(this.stepperZ);
      case Step.ZEROING_END:
        return this.zeroingEnd();
      case Step.ZEROING_END_X:
        return this.zeroingEnd(this.stepperX);
      case Step.ZEROING_END_Y:
        return this.zeroingEnd(this.stepperY);
      case Step.ZEROING_END_Z:
        return this.zeroingEnd(this.stepperZ);
      case Step.DISABLE_STEPPERS:
        return this.disableSteppers();
      case Step.STOP_MOTORS:
        return this.stopMotors();
      case Step.COUNT_STEPS_X:
        return (this.stepperX.count_steps = COUNT_STEPS.ON);
      case Step.COUNT_STEPS_Y:
        return (this.stepperY.count_steps = COUNT_STEPS.ON);
      case Step.COUNT_STEPS_Z:
        return (this.stepperZ.count_steps = COUNT_STEPS.ON);
      case Step.COUNT_STEPS_X_OFF:
        return (this.stepperX.count_steps = COUNT_STEPS.OFF);
      case Step.COUNT_STEPS_Y_OFF:
        return (this.stepperY.count_steps = COUNT_STEPS.OFF);
      case Step.COUNT_STEPS_Z_OFF:
        return (this.stepperZ.count_steps = COUNT_STEPS.OFF);
      case Step.GET_STEPPER_STEPS_X:
        return this.getStepperSteps(this.stepperX);
      case Step.GET_STEPPER_STEPS_Y:
        return this.getStepperSteps(this.stepperY);
      case Step.GET_STEPPER_STEPS_Z:
        return this.getStepperSteps(this.stepperZ);
      case Step.SET_VALVE_1_OFF:
        return this.setValveState(1, VALVE_STATE.CLOSED);
      case Step.SET_VALVE_1_ON:
        return this.setValveState(1, VALVE_STATE.OPEN);
      case Step.SET_VALVE_2_OFF:
        return this.setValveState(2, VALVE_STATE.CLOSED);
      case Step.SET_VALVE_2_ON:
        return this.setValveState(2, VALVE_STATE.OPEN);
      case Step.ZEROING_END_S:
        return this.stepperEndS();
      case Step.ZEROING_START_S:
        return this.stepperStartS();
      default:
        return;
    }
  };

  setStepperVelocity = (stepper: Stepper, velocity: number) => {
    const { full_rev_mm, microstepping } = stepper;
    const step_sleep_milli = (full_rev_mm * microstepping) / (360.0 * velocity);
    stepper.step_sleep_millis = Math.round(step_sleep_milli);
  };

  getStepperVelocity = (stepper: Stepper) => {
    const { full_rev_mm, microstepping, step_sleep_millis } = stepper;
    // return (full_rev_mm * microstepping) / (360.0 * step_sleep_millis);
    const stepsPerRevolution = microstepping * 2;
    const distancePerStep = full_rev_mm / stepsPerRevolution;
    const stepTimeMillis = step_sleep_millis;
    const velocity = (distancePerStep / stepTimeMillis) * 1000; // convert to millimeters per second
    return Number(velocity.toFixed(3));
  };

  setValveState = (number: 1 | 2, state: VALVE_STATE) => {
    const command = number === 1 ? setValve1Command : setValve2Command;
    return this.executeCommand(command(state));
  };

  setPressure = (val: number) => {
    return this.executeCommand(setPressureCommand(val));
  };
}

export const appStore = createSingleton(AppStore);
