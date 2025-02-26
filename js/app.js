const validWords = ["apple", "table", "chair", "store", "world", "plant", "drink", "flame"];
let secretWord = validWords[Math.floor(Math.random() * validWords.length)];
let attempts = 6;
let nextLetter = 0;
let guess = '';
let currentRow = 0;
let gameOver = false;
console.log(secretWord);

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
            // cell.setAttribute('contenteditable', true);
            cell.setAttribute('maxlength', 1);
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}
console.log();

// Accept User Input through physical keyboard events
document.addEventListener("keyup", (e) => {

    if (attempts === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) { // nothing to delete until something is inserted
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi); // case-insensitive search of all occurrences
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

// handle keyboard input through clicks on virtual keyboard buttons 
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key})); // simulates the action of pressing a key on a physical keyboard
})

function removeLastLetter(str) {
    return str.slice(0, -1);
}

function deleteLetter() {
    let row = document.getElementsByClassName("row")[6 - attempts]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    guess = removeLastLetter(guess)
    console.log("Guess: " + guess);
    nextLetter -= 1
}

function insertLetter (pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("row")[6 - attempts]
    let box = row.children[nextLetter]
    console.log(box);
    box.textContent = pressedKey
    box.classList.add("filled-cell")
    guess += pressedKey;
    console.log("Guess: " + guess);
    nextLetter += 1
}


// Submit guess with Enter key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        submitGuess();
    }
});

// Initialize the game on page load
initializeGameBoard();