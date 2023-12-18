const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverText = document.querySelector('.gameOverText');
const restartBtn = document.getElementById('restartButton');
let options = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let running = false;
let isSinglePlayer = false;

document.getElementById('singlePlayerBtn').addEventListener('click', () => startGame(true));
document.getElementById('multiPlayerBtn').addEventListener('click', () => startGame(false));
restartBtn.addEventListener('click', restartGame);

function startGame(singlePlayer) {
    isSinglePlayer = singlePlayer;
    document.getElementById('gameModeSelection').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    initializeGame();
}

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute('cellindex');
    if (options[cellIndex] !== '' || !running) {
        return;
    }
    updateCell(this, cellIndex);
    if (checkWinner()) return;
    if (checkDraw()) return;
    if (isSinglePlayer && currentPlayer === 'X') {
        switchPlayer();
        aiMove();
    } else {
        switchPlayer();
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function aiMove() {
    let availableSpots = options.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);

    if (availableSpots.length === 0) {
        return;
    }

    let aiCellIndex = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    options[aiCellIndex] = 'O';
    cells[aiCellIndex].textContent = 'O';
    if (checkWinner()) return;
    if (checkDraw()) return;
    switchPlayer();
}

function switchPlayer() {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let checker = false;
    for (let i = 0; i < winConditions.length; i++) {
        const combo = winConditions[i];
        const a = options[combo[0]];
        const b = options[combo[1]];
        const c = options[combo[2]];

        if (a === b && b === c && b != '') {
            checker = true;
            break;
        }
    }

    if (checker) {
        endGame(`${currentPlayer} wins!`);
        return true;
    }
    return false;
}

function checkDraw() {
    if (!options.includes('')) {
        endGame(`Draw!`);
        return true;
    }
    return false;
}

function endGame(text) {
    gameOverText.textContent = text;
    gameOverScreen.style.display = 'flex';
    running = false;
}

function restartGame() {
    currentPlayer = 'X';
    options = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    gameOverScreen.style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById('gameModeSelection').style.display = 'block';
}
