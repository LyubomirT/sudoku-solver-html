const boardElement = document.getElementById('board');
    const messageElement = document.getElementById('message');
    const boardSizeElement = document.getElementById('board-size');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    let boardSize = parseInt(boardSizeElement.value);
    let board;

    function createBoard() {
      boardElement.innerHTML = '';
      board = [];
      for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          const input = document.createElement('input');
          input.type = 'text';
          if (boardSize == 16) {
            input.maxLength = '2';
          } else {
            input.maxLength = '1';
          }
          cell.appendChild(input);
          board[i][j] = input;
          boardElement.appendChild(cell);
        }
      }
      boardElement.style.setProperty('--size', boardSize);
    }

    function clearBoard() {
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          board[i][j].value = '';
        }
      }
      messageElement.textContent = '';
    }

    function solveSudoku() {
      const puzzle = [];
      for (let i = 0; i < boardSize; i++) {
        puzzle[i] = [];
        for (let j = 0; j < boardSize; j++) {
          const value = parseInt(board[i][j].value);
          puzzle[i][j] = isNaN(value) ? 0 : value;
        }
      }

      if (isValidSudoku(puzzle)) {
        const solvedPuzzle = solve(puzzle, boardSize); // Pass boardSize as a parameter
        if (solvedPuzzle) {
          for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
              board[i][j].value = solvedPuzzle[i][j];
            }
          }
          messageElement.textContent = 'Puzzle solved!';
        } else {
          messageElement.textContent = 'Unsolvable puzzle!';
        }
      } else {
        messageElement.textContent = 'Invalid puzzle!';
      }
    }

    function isValidSudoku(puzzle) {
      const boardSize = puzzle.length;
      const subGridSize = Math.sqrt(boardSize);

      // Check rows and columns
      for (let i = 0; i < boardSize; i++) {
        const rowSet = new Set();
        const colSet = new Set();
        for (let j = 0; j < boardSize; j++) {
          const rowValue = puzzle[i][j];
          const colValue = puzzle[j][i];
          if (rowValue > boardSize || colValue > boardSize) return false; // Check if value is bigger than board size
          if (rowValue !== 0 && rowSet.has(rowValue)) return false;
          if (colValue !== 0 && colSet.has(colValue)) return false;
          rowSet.add(rowValue);
          colSet.add(colValue);
        }
      }

      // Check sub-grids
      for (let i = 0; i < boardSize; i += subGridSize) {
        for (let j = 0; j < boardSize; j += subGridSize) {
          const subGridSet = new Set();
          for (let x = i; x < i + subGridSize; x++) {
            for (let y = j; y < j + subGridSize; y++) {
              const value = puzzle[x][y];
              if (value > boardSize) return false; // Check if value is bigger than board size
              if (value !== 0 && subGridSet.has(value)) return false;
              subGridSet.add(value);
            }
          }
        }
      }

      return true;
    }

    function solve(puzzle, boardSize) { // Add boardSize as a parameter
      const emptyCell = findEmptyCell(puzzle);
      if (!emptyCell) return puzzle;

      const [row, col] = emptyCell;
      for (let num = 1; num <= boardSize; num++) {
        if (isValidMove(puzzle, row, col, num)) {
          puzzle[row][col] = num;
          const result = solve(puzzle, boardSize); // Pass boardSize as a parameter
          if (result) return result;
          puzzle[row][col] = 0;
        }
      }

      return null;
    }

    function findEmptyCell(puzzle) {
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (puzzle[i][j] === 0) {
            return [i, j];
          }
        }
      }
      return null;
    }

    function isValidMove(puzzle, row, col, num) {
      // Check row and column
      for (let i = 0; i < boardSize; i++) {
        if (puzzle[row][i] === num || puzzle[i][col] === num) {
          return false;
        }
      }

      // Check sub-grid
      const subGridSize = Math.sqrt(boardSize);
      const subGridRow = Math.floor(row / subGridSize) * subGridSize;
      const subGridCol = Math.floor(col / subGridSize) * subGridSize;
      for (let i = 0; i < subGridSize; i++) {
        for (let j = 0; j < subGridSize; j++) {
          if (puzzle[subGridRow + i][subGridCol + j] === num) {
            return false;
          }
        }
      }

      return true;
    }

    function toggleDarkMode() {
      const darkModeEnabled = darkModeToggle.checked;
      if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }

    boardSizeElement.addEventListener('change', function () {
      boardSize = parseInt(boardSizeElement.value);
      createBoard();
    });

    createBoard();