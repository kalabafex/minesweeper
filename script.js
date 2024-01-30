const ROWS = 10;
const COLS = 10;
const MINES = 10;

let grid = [];
let mineCount;
let isGameOver = false;

const mineCountDisplay = document.getElementById("mine-count");
const resetButton = document.getElementById("reset-button");
const board = document.getElementById("board");
resetButton.addEventListener("click", initGame);
// Initialize the game
initGame();

function initGame() {
    mineCount = MINES;
    isGameOver = false;
    mineCountDisplay.textContent = mineCount;
    createGrid();
    renderBoard();
}

// Create the grid of cells
function createGrid() {
    grid = [];
    for (let row = 0; row < ROWS; row++) {
        grid[row] = [];
        for (let col = 0; col < COLS; col++) {
            grid[row][col] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            };
        }
    }
    placeMines();
    calculateAdjacentMines();
}

// Place mines randomly on the grid
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        let row = Math.floor(Math.random() * ROWS);
        let col = Math.floor(Math.random() * COLS);
        if (!grid[row][col].isMine) {
            grid[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

// Calculate the number of adjacent mines for each cell
function calculateAdjacentMines() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (!grid[row][col].isMine) {
                let count = countAdjacentMines(row, col);
                grid[row][col].adjacentMines = count;
            }
        }
    }
}

// Helper function to count adjacent mines
function countAdjacentMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
                let neighborRow = row + i;
                let neighborCol = col + j;
                if (isValidCell(neighborRow, neighborCol) && grid[neighborRow][neighborCol].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Check if a cell is within the grid boundaries
function isValidCell(row, col) {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function renderBoard() {
    let html = "";
    for (let row = 0; row < ROWS; row++) {
        html += "<tr>";
        for (let col = 0; col < COLS; col++) {
            let cell = grid[row][col];
            let cellClass = "hidden"; // Initially all cells are hidden
            let cellContent = "";
            if(isGameOver){
                cellClass="revealed";
            }
            if (isGameOver && cell.isMine) {
                cellClass = "mine"; // Reveal mines when game is over
            } else if (cell.isRevealed) {
                cellClass = "revealed";
                if (cell.adjacentMines > 0) {
                    cellContent = cell.adjacentMines; // Show adjacent mine count
                }
            } else if (cell.isFlagged) {
                cellClass = "flagged";
                 // Or use an image for the flag
            }

            html += `<td class="${cellClass}" id="cell-${row}-${col}" 
                    onmousedown="handleClick(${row}, ${col})">
                        ${cellContent}
                    </td>`;
        }
        html += "</tr>";
    }
    board.innerHTML = html;
}

// Handle cell clicks (left-click and right-click)
function handleClick(row, col) {
    if (isGameOver) {
        return;
    }

    let cell = grid[row][col];

    // Event.button: 0 = Left Click, 2 = Right Click
    if (event.button === 0) { // Left-click
        handleLeftClick(cell);
    } else if (event.button === 2) { // Right-click
        handleRightClick(cell);
    }

    checkWinCondition();
    renderBoard(); // Update the board after each click
}

// Handle left-click on a cell
function handleLeftClick(cell) {
    if (cell.isRevealed || cell.isFlagged) {
        return;
    }

    if (cell.isMine) {
        gameOver();
    } else {
        revealCell(cell);
    }
}

function handleRightClick(cell) {
    if (cell.isRevealed) {
        return;
    }

    cell.isFlagged = !cell.isFlagged;
    updateMineCount(); // Call updateMineCount() to update the display
}

// Reveal a cell and its neighbors if necessary
function revealCell(cell) {
    if (cell.isRevealed) {
        return;
    }

    cell.isRevealed = true;

    if (cell.adjacentMines === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let neighborRow = cell.row + i;
                let neighborCol = cell.col + j;
                if (isValidCell(neighborRow, neighborCol)) {
                    let neighborCell = grid[neighborRow][neighborCol];
                    if (!neighborCell.isRevealed && !neighborCell.isFlagged) {
                        revealCell(neighborCell);
                    }
                }
            }
        }
    }
}

// Game over function
function gameOver() {
    isGameOver = true;
    alert("Game Over!"); // You can replace this with a more elaborate game over display
    renderBoard();
}

// Check if the player has won the game
function checkWinCondition() {
    let cellsRevealed = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (!grid[row][col].isMine && grid[row][col].isRevealed) {
                cellsRevealed++;
            }
        }
    }
    if (cellsRevealed === (ROWS * COLS) - MINES) {
        isGameOver = true;
        alert("You Win!");
    }
}

// Update the mine count display
function updateMineCount() {
    let remainingMines = MINES; // Initial number of mines

    // Count the number of flagged cells
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (grid[row][col].isFlagged) {
                remainingMines--;
            }
        }
    }

    mineCountDisplay.textContent = remainingMines; // Update the display
}