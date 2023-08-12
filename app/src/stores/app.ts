import { makeAutoObservable, runInAction } from "mobx";
import createSingleton from "~/stores/utils/createSingleton";
import { io, type Socket } from "socket.io-client";
import { executeCommand } from "~/lib/commandExecutionManager";
import {
  getStepperStepsCommand,
  stepperCountSteps,
  stepperDisable,
  stepperStop,
  stepperZeroingEnd,
  stepperZeroingStart,
} from "~/lib/functions";
import {
  defStepperX,
  defStepperY,
  defStepperZ,
  defStepperS,
} from "~/lib/defaults";
import { type Stepper } from "~/lib/types";
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

  zeroingStart = (stepper?: Stepper) => {
    if (!stepper) {
      return Promise.all([
        this.executeCommand(stepperZeroingStart(this.stepperX)),
        this.executeCommand(stepperZeroingStart(this.stepperY)),
        this.executeCommand(stepperZeroingStart(this.stepperZ)),
      ]);
    }
    return this.executeCommand(stepperZeroingStart(stepper));
  };

  zeroingEnd = (stepper?: Stepper) => {
    if (!stepper) {
      return Promise.all([
        this.executeCommand(stepperZeroingEnd(this.stepperX)),
        this.executeCommand(stepperZeroingEnd(this.stepperY)),
        this.executeCommand(stepperZeroingEnd(this.stepperZ)),
      ]);
    }
    return this.executeCommand(stepperZeroingEnd(stepper));
  };

  disableSteppers = () => {
    return Promise.all([
      this.executeCommand(stepperDisable(this.stepperX)),
      this.executeCommand(stepperDisable(this.stepperY)),
      this.executeCommand(stepperDisable(this.stepperZ)),
    ]);
  };

  stopMotors = () => {
    return Promise.all([
      this.executeCommand(stepperStop(this.stepperX)),
      this.executeCommand(stepperStop(this.stepperY)),
      this.executeCommand(stepperStop(this.stepperZ)),
    ]);
  };

  countSteps = (stepper: Stepper) => {
    return this.executeCommand(stepperCountSteps(stepper));
  };

  getStepperSteps = (stepper: Stepper) => {
    return this.executeCommand(getStepperStepsCommand(stepper));
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
    const step_sleep_milli =
      (stepper.full_rev_mm * stepper.microstepping) / (360.0 * velocity);
    stepper.step_sleep_millis = Math.round(step_sleep_milli);
  };

  getStepperVelocity = (stepper: Stepper) => {
    return (
      (stepper.full_rev_mm * stepper.microstepping) /
      (360.0 * stepper.step_sleep_millis)
    );
  };
}

export const appStore = createSingleton(AppStore);
