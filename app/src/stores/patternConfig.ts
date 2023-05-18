import { makeAutoObservable } from "mobx";
import createSingleton from "~/stores/utils/createSingleton";

class PatternConfigStore {
  selectedAreaId: number | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedAreaId = (id: number | undefined) => {
    this.selectedAreaId = id;
  };
}

export const patternConfigStore = createSingleton(PatternConfigStore);
