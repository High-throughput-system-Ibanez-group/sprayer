import { makeAutoObservable } from "mobx";
import {
  defStepperX,
  defStepperY,
  defStepperZ,
  defStepperS,
} from "~/lib/defaults";
import { type Stepper } from "~/lib/types";
import createSingleton from "~/stores/utils/createSingleton";

class ComponentsStore {
  stepperX: Stepper = defStepperX;
  stepperY: Stepper = defStepperY;
  stepperZ: Stepper = defStepperZ;
  stepperS: Stepper = defStepperS;

  constructor() {
    makeAutoObservable(this);
  }
}

export const componentsStore = createSingleton(ComponentsStore);
