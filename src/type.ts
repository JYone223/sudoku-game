export type ICell = {
  row: number;
  col: number;
};

export type ICurrentCell = ICell & {
  value: number;
  /** 当前空格是输入还是点击 */
  isInput: boolean;
};

export interface ITimerRefHandles {
  toggleTimePause: () => void;
  handleTimeReset: () => void;
  toggleTimeRunning: () => void;
}