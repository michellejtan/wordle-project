const validWords = ["apple", "table", "chair", "store", "world", "plant", "drink", "flame"];
let secretWord = validWords[Math.floor(Math.random() * validWords.length)];
let attempts = 6;
let currentRow = 0;
let gameOver = false;

document.getElementById('attempts-left').textContent = attempts;

const gameBoard = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');

// Initialize the game board
function initializeGameBoard() {
    for (let i = 0; i < attempts; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('contenteditable', true);
            cell.setAttribute('maxlength', 1);
            row.appendChild(cell);
        }

        gameBoard.appendChild(row);
    }
}
console.log();

// Submit guess with Enter key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        submitGuess();
    }
});

// Initialize the game on page load
initializeGameBoard();