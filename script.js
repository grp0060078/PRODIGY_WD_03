const board = document.getElementById('board');
const statusMessage = document.getElementById('status-message');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');
const newGameButton = document.getElementById('new-game-button');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

let player1Wins = 0;
let player2Wins = 0;
let draws = 0;

function renderBoard() {
    board.innerHTML = '';
    gameBoard.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (value !== '') {
            cell.textContent = value;
        }
        if (value === 'X' || value === 'O') {
            cell.classList.add('occupied');
        }
        cell.dataset.index = index;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    });
}

function handleCellClick(event) {
    const clickedIndex = event.target.dataset.index;

    if (gameBoard[clickedIndex] === '' && gameActive) {
        gameBoard[clickedIndex] = currentPlayer;
        renderBoard();
        const gameResult = checkGameResult();
        updateStatusMessage(gameResult);
        if (gameResult === 'win' || gameResult === 'draw') {
            updateScores(gameResult);
            gameActive = false;
            if (gameResult === 'win') {
                celebrateWin();
            }
        } else {
            togglePlayer();
        }
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkGameResult() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return 'win';
        }
    }

    if (!gameBoard.includes('')) {
        return 'draw';
    }

    return 'continue';
}

function updateStatusMessage(result) {
    switch (result) {
        case 'win':
            statusMessage.textContent = `Player ${currentPlayer} wins!`;
            break;
        case 'draw':
            statusMessage.textContent = 'It\'s a draw!';
            break;
        default:
            statusMessage.textContent = `Player ${currentPlayer}'s turn`;
            break;
    }
}

function updateScores(result) {
    if (result === 'win') {
        currentPlayer === 'X' ? player1Wins++ : player2Wins++;
    } else if (result === 'draw') {
        draws++;
    }

    player1ScoreDisplay.textContent = `Player 1: ${player1Wins} wins`;
    player2ScoreDisplay.textContent = `Player 2: ${player2Wins} wins`;
}

function newGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    renderBoard();
    statusMessage.textContent = `Player ${currentPlayer}'s turn`;
}

function celebrateWin() {
    const winningCells = document.querySelectorAll('.cell');
    winningCells.forEach(cell => {
        if (cell.textContent === currentPlayer) {
            cell.classList.add('win');
        }
    });

    const wrapper = document.querySelector('.container');
    const crackerCount = 10; 

    for (let i = 0; i < crackerCount; i++) {
        const cracker = document.createElement('div');
        cracker.classList.add('cracker');
        cracker.style.left = `${Math.random() * wrapper.offsetWidth}px`;
        cracker.style.top = `${Math.random() * wrapper.offsetHeight}px`;
        wrapper.appendChild(cracker);

    
        cracker.addEventListener('animationend', () => {
            wrapper.removeChild(cracker);
        });
    }
}

newGameButton.addEventListener('click', newGame);

renderBoard();