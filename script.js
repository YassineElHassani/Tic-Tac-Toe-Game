const gameBoard = document.getElementById('gameBoard');
const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
const statusMessage = document.getElementById('statusMessage');
const player1Element = document.getElementById('score1');
const player2Element = document.getElementById('score2');

let gridSize = 3;
let winLength = 3;
let player1Symbol = 'X';
let player2Symbol = 'O';
let board = [];
let currentPlayer = 1;
let gameOver = false;
let scores = { player1: 0, player2: 0 };

loadScores();
updateScores();
setupBoard();
setupEventListeners();

function setupBoard() {
    const gridSizeInput = document.getElementById('gridSize');
    const currentGridSize = gridSizeInput ? parseInt(gridSizeInput.value) : gridSize;

    board = Array(currentGridSize).fill().map(() => Array(currentGridSize).fill(''));
    currentPlayer = 1;
    gameOver = false;
    updateDisplay();
    renderBoard();
}

function renderBoard() {
    gameBoard.innerHTML = '';
    const gridSizeInput = document.getElementById('gridSize');
    const currentGridSize = gridSizeInput ? parseInt(gridSizeInput.value) : gridSize;

    gameBoard.style.gridTemplateColumns = `repeat(${currentGridSize}, 1fr)`;

    for (let row = 0; row < currentGridSize; row++) {
        for (let col = 0; col < currentGridSize; col++) {
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            const cellValue = board[row][col];
            if (cellValue) {
                cell.textContent = cellValue;
                cell.classList.add(cellValue.toLowerCase());
            }

            cell.addEventListener('click', () => handleCellClick(row, col));
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    if (gameOver || board[row][col] !== '') return;

    const currentSymbol = currentPlayer === 1 ? player1Symbol : player2Symbol;
    board[row][col] = currentSymbol;

    if (checkWin(row, col)) {
        handleEndGame('win');
    } else if (checkDraw()) {
        handleEndGame('draw');
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateDisplay();
    }

    renderBoard();
}

function checkWin(row, col) {
    const symbol = board[row][col];
    const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1],  // Left Diagonal
        [1, -1]  // Right Diagonal
    ];

    for (const [dx, dy] of directions) {
        let count = 1;

        for (let i = 1; i < winLength; i++) {
            const x = row + i * dx;
            const y = col + i * dy;
            if (x < 0 || x >= gridSize || y < 0 || y >= gridSize || board[x][y] !== symbol) break;
            count++;
        }

        for (let i = 1; i < winLength; i++) {
            const x = row - i * dx;
            const y = col - i * dy;
            if (x < 0 || x >= gridSize || y < 0 || y >= gridSize || board[x][y] !== symbol) break;
            count++;
        }

        if (count >= winLength) return true;
    }

    return false;
}

function checkDraw() {
    return board.every(row => row.every(cell => cell !== ''));
}

function handleEndGame(result) {
    gameOver = true;

    if (result === 'win') {
        scores[`player${currentPlayer}`]++;
        statusMessage.textContent = `Player ${currentPlayer} Wins`;
        statusMessage.className = 'status-message win';
    } else {
        statusMessage.textContent = "It's a Draw";
        statusMessage.className = 'status-message draw';
    }

    saveScores();
    updateScores();
}

function updateDisplay() {
    const savedScores = localStorage.getItem('ticTacToeScores');

    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
}

function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');

    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
}

function updateScores() {
    player1Element.textContent = scores.player1;
    player2Element.textContent = scores.player2;
}

function resetScores() {
    scores = { player1: 0, player2: 0 };
    saveScores();
    updateScores();
}

function applySettings() {
    const gridSizeInput = document.getElementById('gridSize');
    const winLengthInput = document.getElementById('winLength');

    const newSize = parseInt(gridSizeInput.value);
    const newWinLength = parseInt(winLengthInput.value);

    if (newWinLength > newSize) {
        alert('Win Length must be less than or equal to Grid Size');
        winLengthInput.value = newSize;
        return;
    }

    gridSize = newSize;
    winLength = newWinLength;

    const player1SymbolBtn = document.querySelector('.symbol-btn[data-player="1"].active');
    const player2SymbolBtn = document.querySelector('.symbol-btn[data-player="2"].active');

    player1Symbol = player1SymbolBtn.dataset.symbol;
    player2Symbol = player2SymbolBtn.dataset.symbol;

    if (player1Symbol === player2Symbol) {
        alert('Players must choose different symbols');
        return;
    }

    setupBoard();
}

function setupEventListeners() {
    document.getElementById('newGameBtn').addEventListener('click', () => setupBoard());
    document.getElementById('resetScoresBtn').addEventListener('click', () => resetScores());
    document.getElementById('applySettingsBtn').addEventListener('click', () => applySettings());

    document.querySelectorAll('.symbol-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const player = e.target.dataset.player;
            document.querySelectorAll(`.symbol-btn[data-player="${player}"]`).forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    document.getElementById('gridSize').addEventListener('change', (e) => {
        const value = Math.max(3, Math.min(10, parseInt(e.target.value) || 3));
        e.target.value = value;
    });

    document.getElementById('winLength').addEventListener('change', (e) => {
        const gridSize = parseInt(document.getElementById('gridSize').value);
        const value = Math.max(3, Math.min(gridSize, parseInt(e.target.value) || 3));
        e.target.value = value;
    });
}