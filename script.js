const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const winLineDiv = document.getElementById('win-line');
const modeSelectDiv = document.getElementById('mode-select');
const vsComputerBtn = document.getElementById('vs-computer');
const vsPlayerBtn = document.getElementById('vs-player');
const changeModeBtn = document.getElementById('change-mode');
let cells, currentPlayer, gameActive, gameMode = null;

function startGame() {
    board.innerHTML = '';
    winLineDiv.innerHTML = '';
    cells = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

function handleCellClick(e) {
    const idx = e.target.dataset.index;
    if (!gameActive || cells[idx]) return;
    if (gameMode === 'computer' && currentPlayer !== 'X') return;
    cells[idx] = currentPlayer;
    e.target.textContent = currentPlayer;
    const win = checkWinner();
    if (win) {
        statusDiv.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        drawWinLine(win);
    } else if (cells.every(cell => cell)) {
        statusDiv.textContent = "It's a draw!";
        gameActive = false;
    } else {
        if (gameMode === 'computer') {
            currentPlayer = 'O';
            statusDiv.textContent = `Player ${currentPlayer}'s turn`;
            setTimeout(robotMove, 500);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDiv.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

function robotMove() {
    if (!gameActive) return;
    // Find all empty cells
    const emptyIndices = cells.map((cell, i) => cell === null ? i : null).filter(i => i !== null);
    if (emptyIndices.length === 0) return;
    // Pick a random empty cell
    const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    cells[move] = 'O';
    // Update the board visually
    const cellDivs = document.querySelectorAll('.cell');
    cellDivs[move].textContent = 'O';
    const win = checkWinner();
    if (win) {
        statusDiv.textContent = `Player O wins!`;
        gameActive = false;
        drawWinLine(win);
    } else if (cells.every(cell => cell)) {
        statusDiv.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = 'X';
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWinner() {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]          // diags
    ];
    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return { pattern: winPatterns[i], index: i };
        }
    }
    return null;
}

function drawWinLine(win) {
    // Remove any previous line
    winLineDiv.innerHTML = '';
    const line = document.createElement('div');
    line.className = 'line';
    // Position and rotate the line based on the win pattern
    // Board is 3x3, each cell is 80px, gap is 10px
    // The line is centered over the board (width: 260px)
    let rotate = 0, top = 0, left = '50%';
    switch (win.index) {
        case 0: // Top row
            top = 40;
            rotate = 0;
            break;
        case 1: // Middle row
            top = 130;
            rotate = 0;
            break;
        case 2: // Bottom row
            top = 220;
            rotate = 0;
            break;
        case 3: // Left col
            top = 130;
            rotate = 90;
            left = 'calc(50% - 90px)';
            break;
        case 4: // Middle col
            top = 130;
            rotate = 90;
            left = '50%';
            break;
        case 5: // Right col
            top = 130;
            rotate = 90;
            left = 'calc(50% + 90px)';
            break;
        case 6: // Diagonal TL-BR
            top = 130;
            rotate = 45;
            break;
        case 7: // Diagonal TR-BL
            top = 130;
            rotate = -45;
            break;
    }
    line.style.top = top + 'px';
    line.style.left = left;
    line.style.transform = `translateX(-50%) rotate(${rotate}deg)`;
    winLineDiv.appendChild(line);
}


// Mode selection logic
vsComputerBtn.addEventListener('click', () => {
    gameMode = 'computer';
    modeSelectDiv.style.display = 'none';
    restartBtn.style.display = '';
    changeModeBtn.style.display = '';
    startGame();
});
vsPlayerBtn.addEventListener('click', () => {
    gameMode = 'multiplayer';
    modeSelectDiv.style.display = 'none';
    restartBtn.style.display = '';
    changeModeBtn.style.display = '';
    startGame();
});

restartBtn.addEventListener('click', startGame);
changeModeBtn.addEventListener('click', () => {
    modeSelectDiv.style.display = '';
    restartBtn.style.display = 'none';
    changeModeBtn.style.display = 'none';
    board.innerHTML = '';
    winLineDiv.innerHTML = '';
    statusDiv.textContent = '';
});

// Show mode select on page load
window.addEventListener('DOMContentLoaded', () => {
    modeSelectDiv.style.display = '';
    restartBtn.style.display = 'none';
    changeModeBtn.style.display = 'none';
    board.innerHTML = '';
    winLineDiv.innerHTML = '';
    statusDiv.textContent = '';
});
