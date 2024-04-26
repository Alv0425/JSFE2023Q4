import type { LabelType } from "./car-labels";

export interface ICarCallbacks {
  onmoveControls: () => void;
  unlockAllControls: () => void;
  lockStopButton: () => void;
  startAnimation: (duration: number) => void;
  stopAnimation: () => void;
  moveCarToStart: () => void;
  setCarStatus: (status: LabelType[keyof LabelType]) => void;
  lockControls: () => void;
}
