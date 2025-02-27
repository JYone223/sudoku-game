import { useEffect, useRef, useState } from 'react';
import Sudoku from './utils/Sudoku';
import clsx from 'clsx';
import { triggerCelebration } from './utils/celebrationAnimation';
import Toast from './components/Toast';
import Cell from './components/Cell';

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

  const updateCell = (row: number, col: number, value: number) => {
    if (isNaN(value) || value < 1 || value > 9) {
      alert('Invalid input');
      return;
    }

    if (value !== solution[row][col]) {
      Toast.show('❌输入错误，请重新输入', 'error');
      setWrongInputPosition({ row, col });
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
    
    triggerCelebration();
  };

  const resetGame = () => {
    setGrid(sudoku.generatePuzzle(30));
    setSolution(sudoku.generateFullSudoku());
  };

  useEffect(() => {
    checkSolution();

    console.log('checksolution')

    // Toast.show('🎉恭喜，你成功完成了 Sudoku 游戏！', 'success');
  }, [grid]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Sudoku</h1> */}

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
              'opacity-50 cursor-not-allowed': !canUndo,
            }
          )}
          disabled={!canUndo}
        >
          撤回
        </button>
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          重新开始
        </button>
      </div>
    </div>
  );
}
