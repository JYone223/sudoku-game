import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

const Cell = ({
  row,
  col,
  value,
  currentCell,
  setCurrentCell,
  wrongInputPosition,
  updateCell,
}: {
  row: number;
  col: number;
  value: number;
  currentCell: ICurrentCell | null | undefined;
  setCurrentCell: React.Dispatch<
    React.SetStateAction<ICurrentCell | null | undefined>
  >;
  wrongInputPosition: ICell | null | undefined;
  updateCell: (row: number, col: number, value: number) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isWrongInput =
    wrongInputPosition?.row === row && wrongInputPosition?.col === col;
  const hasWrongInput = !!wrongInputPosition;
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (
      currentCell?.row === row &&
      currentCell?.col === col &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }

    if (!currentCell) {
      setIsHover(false);
    }
  }, [currentCell, row, col]);

  return (
    <div
      id={`cell-${row}-${col}`}
      className={clsx(
        'w-12 h-12 flex justify-center items-center text-xl font-bold border border-gray-300',
        {
          'bg-gray-200': value !== 0,
          'bg-white': value === 0,
          'border-b-2 border-b-black': row % 3 === 2,
          'border-r-2 border-r-black': col % 3 === 2,
          'border-t-2 border-t-black': row === 0,
          'border-l-2 border-l-black': col === 0,
          'bg-red-400!': isWrongInput,
          'bg-sky-100!':
            !hasWrongInput &&
            (currentCell?.row === row || currentCell?.col === col),
          'bg-sky-300!':
            !hasWrongInput &&
            ((currentCell?.isInput === false && currentCell?.value === value) ||
              isHover),
        }
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() =>
        value &&
        setCurrentCell((prev) => ({
          ...prev,
          row,
          col,
          value,
          isInput: false,
        }))
      }
    >
      {value ? (
        value
      ) : (
        <input
          ref={inputRef}
          type="string"
          inputMode="numeric"
          maxLength={1}
          disabled={hasWrongInput}
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const num = Number(e.target.value);
            updateCell(row, col, num);
            setCurrentCell({
              row,
              col,
              value: num,
              isInput: true,
            });
          }}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentCell((prev: any) => ({
              ...prev,
              row,
              col,
              value,
              isInput: true,
            }));
          }}
          className={clsx('w-11 h-11 text-center text-xl font-bold p-1', {
            'cursor-not-allowed': hasWrongInput,
          })}
        />
      )}
    </div>
  );
};

export default Cell;
