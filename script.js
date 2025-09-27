// --- configurazione ---
const BOARD_SIZE = 10;      // <— cambia qui se vuoi 6/7/12...
const SHAPE_SIZE = 4;
const shapeCount = 12;

let board = Array.from({ length: BOARD_SIZE }, () =>
  Array.from({ length: BOARD_SIZE }, () => 0)
);
let shapes = [];
let isMouseDown = false;
let isSelecting = true;

const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'lime', 'gray', 'orange', 'purple', 'pink', 'brown'];

document.addEventListener('DOMContentLoaded', () => {
    createBoardGrid();
    createShapeGrids();
    document.addEventListener('mouseup', () => isMouseDown = false);
});

function createBoardGrid() {
    const boardContainer = document.getElementById('board');

    // assicurati che la griglia abbia BOARD_SIZE colonne/righe
    if (boardContainer && boardContainer.style) {
        boardContainer.style.display = 'grid';
        boardContainer.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 30px)`;
        boardContainer.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 30px)`;
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('board-cell');

            // seleziona l'interno (bordo escluso) come "attivo" di default
            if (i > 0 && i < BOARD_SIZE - 1 && j > 0 && j < BOARD_SIZE - 1) {
                cell.classList.add('selected');
                board[i][j] = 1;
            }

            cell.addEventListener('mousedown', (e) => {
                isMouseDown = true;
                isSelecting = !cell.classList.contains('selected');
                toggleCell(cell, board, i, j);
                e.preventDefault(); // evita selezione testo
            });
            cell.addEventListener('mouseover', () => {
                if (isMouseDown) {
                    if (isSelecting && !cell.classList.contains('selected')) {
                        cell.classList.add('selected');
                        board[i][j] = 1;
                    } else if (!isSelecting && cell.classList.contains('selected')) {
                        cell.classList.remove('selected');
                        board[i][j] = 0;
                    }
                }
            });
            boardContainer.appendChild(cell);
        }
    }
}

function createShapeGrids() {
    const shapesContainer = document.getElementById('shapes');
    for (let s = 0; s < shapeCount; s++) {
        const shape = Array.from({ length: SHAPE_SIZE }, () =>
          Array.from({ length: SHAPE_SIZE }, () => 0)
        );
        shapes.push(shape);

        const shapeWrapper = document.createElement('div');
        shapeWrapper.classList.add('shape-container');
        
        const shapeGrid = document.createElement('div');
        shapeGrid.classList.add('grid');
        shapeGrid.style.gridTemplateColumns = `repeat(${SHAPE_SIZE}, 30px)`;
        shapeGrid.style.gridTemplateRows = `repeat(${SHAPE_SIZE}, 30px)`;
        
        const shapeTitle = document.createElement('h5');
        shapeTitle.innerText = `Shape ${s + 1}`;
        shapeWrapper.appendChild(shapeTitle);
        
        for (let i = 0; i < SHAPE_SIZE; i++) {
            for (let j = 0; j < SHAPE_SIZE; j++) {
                const cell = document.createElement('div');
                cell.classList.add('shape-cell');
                cell.addEventListener('mousedown', (e) => {
                    isMouseDown = true;
                    isSelecting = !cell.classList.contains('selected');
                    toggleCell(cell, shape, i, j);
                    e.preventDefault();
                });
                cell.addEventListener('mouseover', () => {
                    if (isMouseDown) {
                        if (isSelecting && !cell.classList.contains('selected')) {
                            cell.classList.add('selected');
                            shape[i][j] = 1;
                        } else if (!isSelecting && cell.classList.contains('selected')) {
                            cell.classList.remove('selected');
                            shape[i][j] = 0;
                        }
                    }
                });
                shapeGrid.appendChild(cell);
            }
        }
        
        shapeWrapper.appendChild(shapeGrid);
        shapesContainer.appendChild(shapeWrapper);
    }
}

function toggleCell(cell, grid, i, j) {
    if (grid[i][j] === 0) {
        grid[i][j] = 1;
        cell.classList.add('selected');
    } else {
        grid[i][j] = 0;
        cell.classList.remove('selected');
    }
}

function submitBoard() {
    document.getElementById('board-container').style.display = 'none';
    document.getElementById('shape-container').style.display = 'block';
}

function submitShapes() {
    document.getElementById('shape-container').style.display = 'none';
    if (solveInventory(board, shapes, 0)) {
        document.getElementById('result-container').style.display = 'block';
        displayResultGrid();
    } else {
        alert("No solution found");
    }
}

function displayResultGrid() {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    // applica anche qui la dimensione della griglia
    resultContainer.style.display = 'grid';
    resultContainer.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 30px)`;
    resultContainer.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 30px)`;

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('board-cell');
            if (board[i][j] !== 0) {
                cell.classList.add('selected');
                cell.style.backgroundColor = board[i][j] === 1 ? 'black' : board[i][j];
            }
            resultContainer.appendChild(cell);
        }
    }
}

function canPlaceShape(board, shape, x, y, color) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                if (x + i >= BOARD_SIZE || y + j >= BOARD_SIZE || board[x + i][y + j] !== 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placeShape(board, shape, x, y, color) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                board[x + i][y + j] = color;
            }
        }
    }
}

function removeShape(board, shape, x, y) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                board[x + i][y + j] = 1;
            }
        }
    }
}

function solveInventory(board, shapes, index) {
    if (index === shapes.length) {
        return true;
    }

    const shape = shapes[index];
    const color = colors[index % colors.length];

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (canPlaceShape(board, shape, i, j, color)) {
                placeShape(board, shape, i, j, color);
                if (solveInventory(board, shapes, index + 1)) {
                    return true;
                }
                removeShape(board, shape, i, j);
            }
        }
    }
    return false;
}

function resetPage() {
    location.reload();
}
