type SudokuGrid = number[][];

class Sudoku {
  private grid: SudokuGrid;

  constructor() {
    this.grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  private isValid(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i] === num || this.grid[i][col] === num) return false;
    }

    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;

    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
      for (let c = boxColStart; c < boxColStart + 3; c++) {
        if (this.grid[r][c] === num) return false;
      }
    }

    return true;
  }

  private fillGrid(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of nums) {
            if (this.isValid(row, col, num)) {
              this.grid[row][col] = num;
              if (this.fillGrid()) return true;
              this.grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  public generateFullSudoku(): SudokuGrid {
    this.fillGrid();
    return this.grid;
  }

  public generatePuzzle(filledCells = 30): SudokuGrid {
    const fullGrid = this.generateFullSudoku();
    const puzzle = fullGrid.map((row) => [...row]);
    const cellsToClear = 81 - filledCells;
    const clearedCells = new Set<number>();

    while (clearedCells.size < cellsToClear) {
      const cell = Math.floor(Math.random() * 81);
      if (!clearedCells.has(cell)) {
        const row = Math.floor(cell / 9);
        const col = cell % 9;
        puzzle[row][col] = 0;
        clearedCells.add(cell);
      }
    }
    return puzzle;
  }
}

export default Sudoku;