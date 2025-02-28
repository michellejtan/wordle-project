const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

let secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
let attempts = MAX_ATTEMPTS;
let nextLetter = 0;
let guess = '';
let currentRow = 0;
let feedback = [];

let gameOver = false;

console.log(secretWord);

const errorSound = new Audio('../assets/audio/error.mp3');


const gameBoard = document.getElementById("game-board");
const attemptsLeftDisplay = document.getElementById("attempts-left");
const statusDisplay = document.getElementById("status");
const keyboardCont = document.getElementById("keyboard-cont");
const resetButton = document.getElementById("reset-button");

function updateAttemptsDisplay() {
    attemptsLeftDisplay.textContent = attempts;
}

function initializeGameBoard() {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < WORD_LENGTH; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("maxlength", 1);
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}

function handleKeyboardInput(key) {
    if (gameOver) {
        return;
    }

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
    box.textContent = pressedKey;
    box.classList.add("filled-cell");
    guess += pressedKey;
    nextLetter += 1;
}

function checkGuess() {
    if (guess.length != WORD_LENGTH) {
        statusDisplay.textContent = "Not enough letters!";
        shakeAllBox();
        return;
    }

    if (!WORDS.includes(guess)) {
        statusDisplay.textContent = `Word (${guess}) not in list!`;
        shakeAllBox();
        return;
    }

    attempts--;
    updateCellLetter(guess);
    updateAttemptsDisplay();

    if (attempts !== 0 && !gameOver) {
        statusDisplay.textContent = `Try again!`;
    }

    if (guess === secretWord) {
        gameOver = true;
        updateAttemptsDisplay();
        statusDisplay.textContent = `Congratulations! You've guessed the word in ${(currentRow + 1)} attempts!`;
        showResetButton();
        return;
    }

    if (guess !== secretWord && attempts === 0) {
        statusDisplay.textContent = `Game Over! The secret word was: ${secretWord}`;
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
    errorSound.volume = .05;
    errorSound.play();
}

function updateCellLetter(guess) {
    let row = document.getElementsByClassName("row")[currentRow];
    let boxes = row.children;

    [...boxes].forEach((box, index) => {
        box.classList.add("flipped");
        setTimeout(() => box.classList.remove("flipped"), 500);
    });

    guess.split("").forEach((letter, i) => {
        let delay = 250 * i;
        setTimeout(() => {
            if (letter === secretWord[i]) {
                feedback[i] = "correct";
                boxes[i].classList.add("correct");
            } else if (secretWord.includes(letter)) {
                feedback[i] = "present";
                boxes[i].classList.add("present");
            } else {
                feedback[i] = "incorrect";
                boxes[i].classList.add("absent");
            }
        }, delay);
    });

    guess.split("").forEach((letter, i) => {
        let delay = 250 * i;
        setTimeout(() => updateKeyBoard(letter, feedback[i]), delay);
    });
};

function updateKeyBoard(letter, feedback) {
    let keyboardButtons = document.querySelectorAll(".keyboard-button");
    let button = Array.from(keyboardButtons).find(btn => btn.textContent === letter);

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
    currentRow += 1;
    nextLetter = 0;
}

function showResetButton() {
    resetButton.style.display = "block";
}

function resetGame() {
    resetButton.style.display = "none";
    gameOver = false;
    attempts = MAX_ATTEMPTS;
    currentRow = 0;
    nextLetter = 0;
    guess = "";
    feedback = [];
    secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    console.log(secretWord);
    statusDisplay.textContent = "";
    updateAttemptsDisplay();

    const rows = document.querySelectorAll(".row");
    rows.forEach(row => row.remove());

    const keys = document.querySelectorAll(".keyboard-button");
    keys.forEach(key => {
        key.classList.remove("correct", "present", "incorrect");
    });

    initializeGameBoard();
}

resetButton.addEventListener("click", resetGame);

initializeGameBoard();