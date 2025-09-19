# Dynamic Tic Tac Toe Game

Configurable Tic Tac Toe game with dynamic grid sizes and customizable win conditions. Built with vanilla JavaScript, HTML5, and CSS3.

![Game Preview](https://img.shields.io/badge/Status-Complete-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Valid-orange)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue)
![Mobile](https://img.shields.io/badge/Mobile-Responsive-purple)

## Features

### Core Gameplay
- **Dynamic Grid Size**: Play on 3×3 to 10×10 grids
- **Configurable Win Condition**: Set how many symbols in a row to win (k)
- **Custom Symbols**: Players can choose X or O
- **Two Player Mode**: Alternating turns with clear player indication
- **Win Detection**: Automatic detection of horizontal, vertical, and diagonal wins
- **Draw Detection**: Smart detection of tie games

### Technical Features
- **Modular Code Structure**: Clean, maintainable JavaScript
- **Event-Driven Architecture**: Efficient DOM manipulation
- **Error Handling**: Robust input validation and error prevention
- **Performance Optimized**: Minimal DOM updates and efficient algorithms

## Game Rules

### Basic Rules
1. **Player Turns**: Player 1 always starts first
2. **Move Validation**: Can only place symbol in empty cells
3. **Win Condition**: First player to get `k` symbols in a row wins
4. **Draw Condition**: Game ends in draw if board is full with no winner

### Win Detection Directions
- **Horizontal**: Left to right (→)
- **Vertical**: Top to bottom (↓)  
- **Diagonal**: Top-left to bottom-right (↘)
- **Anti-diagonal**: Top-right to bottom-left (↙)

## Technical Documentation

### Project Structure
```
dynamic-tic-tac-toe/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling
├── script.js          # JavaScript logic
└── README.md          # This documentation
```

### Core JavaScript Components

#### Global Variables
```javascript
const gameBoard = document.getElementById('gameBoard');           // DOM: Game board container
const currentPlayerDisplay = document.getElementById('currentPlayerDisplay'); // DOM: Current player indicator
const statusMessage = document.getElementById('statusMessage');   // DOM: Game status messages
const player1Element = document.getElementById('score1');         // DOM: Player 1 score
const player2Element = document.getElementById('score2');         // DOM: Player 2 score

let gridSize = 3;          // Current grid dimensions (n×n)
let winLength = 3;         // Required symbols in a row to win (k)
let player1Symbol = 'X';   // Player 1's chosen symbol
let player2Symbol = 'O';   // Player 2's chosen symbol
let board = [];            // 2D array representing game state
let currentPlayer = 1;     // Current active player (1 or 2)
let gameOver = false;      // Game state flag
let scores = { player1: 0, player2: 0 }; // Persistent score tracking
```

### Core Functions

#### `setupBoard()`
**Purpose**: Initialize a new game with current settings
```javascript
function setupBoard() {
    const gridSizeInput = document.getElementById('gridSize');
    const currentGridSize = gridSizeInput ? parseInt(gridSizeInput.value) : gridSize;
    
    board = Array(currentGridSize).fill().map(() => Array(currentGridSize).fill(''));
    currentPlayer = 1;
    gameOver = false;
    updateDisplay();
    renderBoard();
}
```
**Process**:
1. Get current grid size from input
2. Create empty 2D array for board
3. Reset game state variables
4. Update UI displays
5. Render fresh board

#### `renderBoard()`
**Purpose**: Create and display the visual game board
```javascript
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
```
**Process**:
1. Clear existing board HTML
2. Set CSS grid columns based on size
3. Create button element for each cell
4. Add click event listeners
5. Apply existing symbols and styling

#### `handleCellClick(row, col)`
**Purpose**: Process player moves and game state changes
```javascript
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
```
**Process**:
1. **Validate Move**: Check if cell is empty and game is active
2. **Place Symbol**: Add current player's symbol to board array
3. **Check Win**: Call win detection algorithm
4. **Check Draw**: Verify if board is full
5. **Switch Players**: Toggle between player 1 and 2
6. **Update UI**: Refresh board and displays

#### `checkWin(row, col)`
**Purpose**: Detect if the current move creates a winning condition
```javascript
function checkWin(row, col) {
    const symbol = board[row][col];
    const directions = [
        [ 0, 1 ],  // Horizontal →
        [ 1, 0 ],  // Vertical ↓
        [ 1, 1 ],  // Diagonal ↘
        [ 1, -1 ]  // Anti-diagonal ↙
    ];

    for (const [dx, dy] of directions) {
        let count = 1; // Start with current cell

        // Check positive direction
        for (let i = 1; i < winLength; i++) {
            const x = row + i * dx;
            const y = col + i * dy;
            if (x < 0 || x >= gridSize || y < 0 || y >= gridSize || board[x][y] !== symbol) break;
            count++;
        }

        // Check negative direction
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
```
**Algorithm Explanation**:
- **Bidirectional Checking**: Counts symbols in both directions from placed symbol
- **Boundary Validation**: Prevents array out-of-bounds errors
- **Symbol Matching**: Only counts consecutive matching symbols
- **Dynamic Win Length**: Works with any win length (k) setting

### Data Persistence

#### LocalStorage Integration
```javascript
// Save scores to localStorage
function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

// Load scores from localStorage
function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
}
```

**Data Structure**:
```javascript
{
    "player1": 5,    // Player 1's total wins
    "player2": 3     // Player 2's total wins
}
```

### Event Handling

#### Settings Management
```javascript
function applySettings() {
    const gridSizeInput = document.getElementById('gridSize');
    const winLengthInput = document.getElementById('winLength');
    
    const newSize = parseInt(gridSizeInput.value);
    const newWinLength = parseInt(winLengthInput.value);

    // Validation: Win length cannot exceed grid size
    if (newWinLength > newSize) {
        alert('Win Length must be less than or equal to Grid Size');
        winLengthInput.value = newSize;
        return;
    }

    gridSize = newSize;
    winLength = newWinLength;

    // Get selected symbols
    const player1SymbolBtn = document.querySelector('.symbol-btn[data-player="1"].active');
    const player2SymbolBtn = document.querySelector('.symbol-btn[data-player="2"].active');

    player1Symbol = player1SymbolBtn.dataset.symbol;
    player2Symbol = player2SymbolBtn.dataset.symbol;

    // Validation: Players must have different symbols
    if (player1Symbol === player2Symbol) {
        alert('Players must choose different symbols');
        return;
    }

    setupBoard();
}
```

#### Input Validation
```javascript
// Grid size validation (3-10)
document.getElementById('gridSize').addEventListener('change', (e) => {
    const value = Math.max(3, Math.min(10, parseInt(e.target.value) || 3));
    e.target.value = value;
});

// Win length validation (3 to current grid size)
document.getElementById('winLength').addEventListener('change', (e) => {
    const gridSize = parseInt(document.getElementById('gridSize').value);
    const value = Math.max(3, Math.min(gridSize, parseInt(e.target.value) || 3));
    e.target.value = value;
});
```

## Manual Checklist

#### Basic Functionality
- [ ] Game starts with Player 1
- [ ] Players alternate turns correctly
- [ ] Symbols appear in clicked cells
- [ ] Cannot click occupied cells
- [ ] Cannot play after game ends

#### Win Detection
- [ ] Horizontal wins detected (all directions)
- [ ] Vertical wins detected (all directions)  
- [ ] Diagonal wins detected (both diagonals)
- [ ] Win detection works for custom win lengths
- [ ] Win detection works on different grid sizes

#### Draw Detection
- [ ] Draw declared when board full with no winner
- [ ] Draw message displays correctly
- [ ] Game properly ends on draw

#### Settings & Configuration
- [ ] Grid size changes work (3×3 to 10×10)
- [ ] Win length changes work (3 to grid size)
- [ ] Symbol selection works for both players
- [ ] Settings validation prevents invalid configurations
- [ ] Settings apply correctly and start new game

#### Data Persistence
- [ ] Scores save between page refreshes
- [ ] Score reset button works
- [ ] LocalStorage data structure is correct

#### Responsive Design
- [ ] Game works on mobile devices
- [ ] Game works on tablets
- [ ] Game works on desktop
- [ ] All controls accessible on all screen sizes

### Edge Cases
- [ ] Grid size 3×3 with win length 3
- [ ] Grid size 10×10 with win length 10
- [ ] Win on last possible move
- [ ] Multiple potential wins in same move
- [ ] Browser with localStorage disabled