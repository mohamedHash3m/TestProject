const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const pvpButton = document.getElementById('pvp');
const pvcButton = document.getElementById('pvc');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let isComputerMode = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();

    if (gameActive && isComputerMode && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        status.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        status.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
}

function computerMove() {
    const emptyCells = gameState.reduce((acc, cell, index) => 
        cell === '' ? acc.concat(index) : acc, []);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerChoice = emptyCells[randomIndex];

    gameState[computerChoice] = currentPlayer;
    cells[computerChoice].textContent = currentPlayer;

    checkResult();
}

function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

function startGame(mode) {
    isComputerMode = mode === 'computer';
    resetGame();
    pvpButton.style.display = 'none';
    pvcButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
    gameActive = true;
    status.textContent = `Player X's turn`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', () => {
    resetGame();
    pvpButton.style.display = 'inline-block';
    pvcButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
    gameActive = false;
    status.textContent = 'Select a game mode';
});
pvpButton.addEventListener('click', () => startGame('player'));
pvcButton.addEventListener('click', () => startGame('computer'));
