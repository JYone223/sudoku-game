declare type ICell = {
  row: number;
  col: number;
};

declare type ICurrentCell = ICell & {
  value: number;
  /** 当前空格是输入还是点击 */
  isInput: boolean;
};
