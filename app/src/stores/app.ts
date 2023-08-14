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
import { type VALVE_STATE, type Stepper } from "~/lib/types";
import { Step } from "~/lib/sequences";

class AppStore {
  socket: Socket | undefined = undefined;
  stepperX: Stepper = defStepperX;
  stepperY: Stepper = defStepperY;
  stepperZ: Stepper = defStepperZ;
  stepperS: Stepper = defStepperS;

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

  getPressure = () => {
    return this.executeCommand(getPressureCommand());
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
        return this.countSteps(this.stepperX);
      case Step.COUNT_STEPS_Y:
        return this.countSteps(this.stepperY);
      case Step.COUNT_STEPS_Z:
        return this.countSteps(this.stepperZ);
      case Step.GET_STEPPER_STEPS_X:
        return this.getStepperSteps(this.stepperX);
      case Step.GET_STEPPER_STEPS_Y:
        return this.getStepperSteps(this.stepperY);
      case Step.GET_STEPPER_STEPS_Z:
        return this.getStepperSteps(this.stepperZ);
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
    return (full_rev_mm * microstepping) / (360.0 * step_sleep_millis);
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
