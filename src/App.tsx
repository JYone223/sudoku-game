import { useEffect, useState, useRef } from 'react';
import Sudoku from './utils/Sudoku';
import clsx from 'clsx';
import {
  triggerCelebration,
  triggerFireworks,
} from './utils/celebrationAnimation';
import Cell from './components/Cell';
import Toast from './components/Toast';
import Timer from './components/Timer';
import { ICell, ICurrentCell, ITimerRefHandles } from './type';

const sudoku = new Sudoku();

export default function App() {
  const [grid, setGrid] = useState<number[][]>(sudoku.generatePuzzle(30));
  const [solution, setSolution] = useState<number[][]>(
    sudoku.generateFullSudoku()
  );
  const [history, setHistory] = useState<number[][][]>([]);
  const canUndo = history.length > 0;
  const [currentCell, setCurrentCell] = useState<ICurrentCell | null>();
  const [wrongInputPosition, setWrongInputPosition] = useState<ICell | null>();
  const [wrongTimes, setWrongTimes] = useState<number>(0);
  const isWrongLimited = wrongTimes > 2;
  const timerRef = useRef<ITimerRefHandles>(null);

  const updateCell = (row: number, col: number, value: number) => {
    if (isNaN(value) || value < 1 || value > 9) {
      alert('Invalid input');
      return;
    }

    if (value !== solution[row][col]) {
      setWrongInputPosition({ row, col });

      if (wrongTimes >= 2) {
        Toast.show('很遗憾，错误次数超出限制 🙅，请重新开始游戏', 'error', 10000);
        timerRef.current?.toggleTimeRunning();
        // todo: 弹窗提示错误次数达到上限，提供 重新开始新的游戏 或 从头开始本盘游戏
      } else {
        Toast.show('输入错误，请撤回后重新输入', 'error');
      }
      setWrongTimes((prev) => prev + 1);
    } else {
      setWrongInputPosition(null);
    }

    // 深拷贝 grid 数组对象并添加到历史记录中
    setHistory((prevHistory) => [
      ...prevHistory,
      JSON.parse(JSON.stringify(grid)),
    ]);

    const newGrid = grid.map((rowArr, r) =>
      rowArr.map((val, c) => (r === row && c === col ? value : val))
    );
    setGrid(newGrid);
  };

  const undo = () => {
    const prevGrid = history[history.length - 1];
    setHistory((prevHistory) => prevHistory.slice(0, -1));
    setGrid(prevGrid);
    setCurrentCell(null);
    setWrongInputPosition(null);
  };

  const checkSolution = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== solution[row][col]) {
          return;
        }
      }
    }
    Toast.show('🎉 恭喜，你成功完成了 Sudoku 游戏！', 'success');
    triggerCelebration();
    setCurrentCell(null);
    setHistory([]);
    timerRef.current?.toggleTimeRunning();
  };

  const resetGame = () => {
    setGrid(sudoku.generatePuzzle(30));
    setSolution(sudoku.generateFullSudoku());
    setCurrentCell(null);
    setWrongInputPosition(null);
    setHistory([]);
    timerRef.current?.handleTimeReset();
  };

  useEffect(() => {
    checkSolution();
  }, [grid]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex justify-center items-center w-full space-x-8">
        <div className={clsx({ 'text-red-400': isWrongLimited })}>
          <span className="text-red-400">{wrongTimes}</span> / 3 错误次数
        </div>

        <Timer ref={timerRef} />
      </div>
      <div className="grid grid-cols-9 w-fit bg-white p-2 rounded-lg shadow-lg">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              value={cell}
              currentCell={currentCell}
              setCurrentCell={setCurrentCell}
              wrongInputPosition={wrongInputPosition}
              updateCell={updateCell}
            />
          ))
        )}
      </div>
      <div className="mt-6 space-x-4">
        <button
          onClick={undo}
          className={clsx(
            'px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition',
            {
              'opacity-50 cursor-not-allowed': !canUndo || isWrongLimited,
            }
          )}
          disabled={!canUndo || isWrongLimited}
        >
          撤回
        </button>
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          重新开始
        </button>
        <button
          onClick={triggerFireworks}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          放松一下 🎆
        </button>
      </div>
    </div>
  );
}
