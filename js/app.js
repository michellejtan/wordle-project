const validWords = ["apple", "table", "chair", "store", "world", "plant", "drink", "flame"];
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

let secretWord = validWords[Math.floor(Math.random() * validWords.length)];
let attempts = MAX_ATTEMPTS;
let nextLetter = 0;
let guess = '';
let currentRow = 0;
let feedback = [];

let gameOver = false;
console.log(secretWord);


const gameBoard = document.getElementById("game-board");
const attemptsLeftDisplay = document.getElementById("attempts-left");
const statusDisplay = document.getElementById("status");
const keyboardCont = document.getElementById("keyboard-cont");
const resetButton = document.getElementById("reset-button");



// const keyboard = document.getElementById("keyboard");

function updateAttemptsDisplay() {
    attemptsLeftDisplay.textContent = attempts;
}

// Initialize the game board
function initializeGameBoard() {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < WORD_LENGTH; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            // cell.setAttribute('contenteditable', true);
            cell.setAttribute("maxlength", 1);
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}
function handleKeyboardInput(key) {
    if (gameOver) return;

    if (key === "Backspace" && nextLetter > 0) {
        deleteLetter();
        return;
    }

    if (key === "Enter") {
        checkGuess();
        return;
    }

    if (/[a-z]/i.test(key) && key.length === 1) {
        insertLetter(key);
    }
}

document.addEventListener("keyup", (e) => {
    handleKeyboardInput(e.key);
});

keyboardCont.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("keyboard-button")) {
        let key = target.textContent;
        if (key === "Del") key = "Backspace";
        handleKeyboardInput(key);
    }
});

function removeLastLetter(str) {
    return str.slice(0, -1);
}

function deleteLetter() {
    let row = document.getElementsByClassName("row")[currentRow];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-cell");
    guess = removeLastLetter(guess);
    console.log("Guess: " + guess);
    nextLetter -= 1;
}

function insertLetter(pressedKey) {
    statusDisplay.textContent = "";

    if (nextLetter === WORD_LENGTH) {
        return;
    }
    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("row")[currentRow];
    let box = row.children[nextLetter];
    console.log(box);
    box.textContent = pressedKey;
    box.classList.add("filled-cell");
    guess += pressedKey;
    console.log("Guess: " + guess);
    nextLetter += 1;
}

function checkGuess() {

    if (guess.length != WORD_LENGTH) {
        console.log("Not enough letters!");
        statusDisplay.textContent = "Not enough letters!";
        shakeAllBox();
        return;
    }

    if (!validWords.includes(guess)) {
        console.log("Word not in list!");
        statusDisplay.textContent = "Not enough letters!";
        shakeAllBox();
        return;
    }

    // after all erros
    updateCellLetter(guess);
    attempts--;
    updateAttemptsDisplay();

    if (guess === secretWord) {
        console.log("Congratulations! You guessed the word!");
        gameOver = true;
        updateAttemptsDisplay();
        statusDisplay.textContent = `Congratulations! You've guessed the word in ${(currentRow + 1)} attempts!`;
        showResetButton();    }

    if (attempts !== 0 && !gameOver) {
        console.log("Try again!");
        statusDisplay.textContent = `Try again!`;
    }
    // console.log("at the end: " + attempts);
    if (attempts === 0) {
        statusDisplay.textContent = `Game Over! The secret word was: ${secretWord}`;
        console.log(`Game Over! The secret word was: ${secretWord}`);
        gameOver = true;
        showResetButton();
    }


    resetGuess();
}

function shakeAllBox() {
    let row = document.getElementsByClassName("row")[currentRow];

    for (let i = 0; i < row.children.length; i++) {
        let box = row.children[i];
        box.classList.add('shake');

        setTimeout(function () {
            box.classList.remove('shake');
        }, 500);
    }

}

function updateCellLetter(guess) {
    let row = document.getElementsByClassName("row")[currentRow];
    let boxes = row.children;

    for (let index = 0; index < boxes.length; index++) {
        boxes[index].classList.add("flipped");

        setTimeout(function () {
            boxes[index].classList.remove("flipped");
        }, 500);
    }


    // After flipping, check the guess and update the cells
    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guess[i];
        const correctLetter = secretWord[i];
        let delay = 250 * i;
        setTimeout(() => {
            if (letter === correctLetter) {
                feedback[i] = "correct"; // Green for correct letter in correct place
                boxes[i].classList.add("correct");
            } else if (secretWord.includes(letter)) {
                feedback[i] = "present"; // Yellow for correct letter in wrong place
                boxes[i].classList.add("present");
            } else {
                feedback[i] = "incorrect"; // Black for incorrect letter
                boxes[i].classList.add("absent");
            }
        }, delay);
    }

    console.log(feedback);
    for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        let delay = 250 * i;
        setTimeout(() => {
            updateKeyBoard(letter, feedback[i]);
        }, delay);
    }
};

function updateKeyBoard(letter, feedback) {
    let keyboardButtons = document.querySelectorAll(".keyboard-button");
    let button = Array.from(keyboardButtons).find(btn => btn.textContent === letter);
    if (!button) {
        console.warn(`Button for letter "${letter}" not found.`);
        return; // If the button is not found, exit the function early
    }
    if (button.classList.contains("correct")) {
        return;
    }
    if (button.classList.contains("present") && feedback != "correct") {
        return;
    }
    if (button.classList.contains("present") && feedback == "correct") {
        button.classList.remove("present");
        button.classList.add("correct");
    }
    button.classList.add(feedback);
}

function resetGuess() {
    guess = "";
    currentRow += 1;  // Move to the next row
    nextLetter = 0;   // Reset the letter position for the next row
}
function showResetButton() {
    resetButton.style.display = "block";
}



// Initialize the game on page load
initializeGameBoard();