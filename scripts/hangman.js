document.addEventListener("DOMContentLoaded", () => {
    class Hangman {
        constructor() {
            this.wordDisplay = document.getElementById("word-display");
            this.hintDisplay = document.querySelector("#hint span");
            this.letterInput = document.getElementById("letter-input");
            this.guessButton = document.getElementById("guess-button");
            this.hangmanImg = document.getElementById("hangman-img");
            this.playAgainBtn = document.getElementById("play-again");
            this.gameMessage = document.getElementById("game-message");
            this.incorrectGuessesDisplay = document.getElementById("incorrect-guesses");

            this.words = [];
            this.selectedWord = "";
            this.hint = "";
            this.guessedLetters = [];
            this.incorrectGuesses = [];
            this.maxWrongGuesses = 6;

            this.loadWords();
            this.guessButton.addEventListener("click", () => this.handleGuess());
            this.playAgainBtn.addEventListener("click", () => this.startGame());

            this.letterInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    this.handleGuess();
                }
            });
        }

        async loadWords() {
            const response = await fetch("data/words.json");
            this.words = await response.json();
            this.startGame();
        }

        startGame() {
            this.gameMessage.textContent = "";
            this.playAgainBtn.classList.add("hidden");
            this.letterInput.value = "";
            this.letterInput.disabled = false;
            this.guessButton.disabled = false;
            this.incorrectGuessesDisplay.textContent = "Incorrect Guesses: ";

            const randomIndex = Math.floor(Math.random() * this.words.length);
            this.selectedWord = this.words[randomIndex].word.toUpperCase();
            this.hint = this.words[randomIndex].hint;
            this.guessedLetters = [];
            this.incorrectGuesses = [];

            this.hangmanImg.src = `resources/hangman0.png`;
            this.hintDisplay.textContent = this.hint;
            this.wordDisplay.innerHTML = this.selectedWord.replace(/./g, "_ ");
        }

        handleGuess() {
            const letter = this.letterInput.value.toUpperCase();
            if (!letter || letter.length !== 1 || this.guessedLetters.includes(letter)) return;

            this.guessedLetters.push(letter);

            if (this.selectedWord.includes(letter)) {
                this.updateWordDisplay();
            } else {
                this.incorrectGuesses.push(letter);
                this.hangmanImg.src = `resources/hangman${this.incorrectGuesses.length}.png`;
                this.incorrectGuessesDisplay.textContent = `Incorrect Guesses: ${this.incorrectGuesses.join(", ")}`;
            }

            this.letterInput.value = "";
            this.checkGameStatus();
        }

        updateWordDisplay() {
            this.wordDisplay.innerHTML = this.selectedWord
                .split("")
                .map(letter => (this.guessedLetters.includes(letter) ? letter : "_"))
                .join(" ");
        }

        checkGameStatus() {
            if (!this.wordDisplay.innerText.includes("_")) {
                this.endGame("You Win!");
            } else if (this.incorrectGuesses.length >= this.maxWrongGuesses) {
                this.endGame(`You Lose! The word was ${this.selectedWord}.`);
            }
        }

        endGame(message) {
            this.gameMessage.textContent = message;
            this.playAgainBtn.classList.remove("hidden");
            this.letterInput.disabled = true;
            this.guessButton.disabled = true;
        }
    }

    new Hangman();
});