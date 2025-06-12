const RANDOM_QUOTE = "https://geek-jokes.sameerkumar.website/api?format=json";
const quoteBoard = document.querySelector("#quote");
const textArea = document.querySelector("#input");
const resetButton = document.getElementById("restart-btn");
const displayTime = document.getElementById("time");
const resultDisplay = document.getElementById("result");
const resultDisplayBox = document.querySelector(".popup-outer");
const closePopUpBtn = document.querySelector(".close-btn");
const startBtn = document.querySelector("#start-btn");

let isGameOn = false;
let timerId = null;
let seconds = 0;
let reverseTimer = 60;
let quoteGot = "";
let quoteArr = [];
let currentWordIndex = 0;
let wordsCorrect = 0;

async function loadQuote() {
  const response = await fetch(RANDOM_QUOTE);
  const data = await response.json();
  quoteGot = data.joke;
  quoteBoard.innerHTML = quoteGot;
  quoteArr = quoteGot.trim().split(/\s+/);
  currentWordIndex = 0;
  textArea.value = "";
  textArea.disabled = false;
  textArea.focus();
}

function startGame() {
  // Reset game state
  wordsCorrect = 0;
  seconds = 0;
  reverseTimer = 60;
  displayTime.innerHTML = reverseTimer;
  textArea.disabled = false;
  textArea.value = "";
  resultDisplayBox.style.display = "none";

  loadQuote();
  isGameOn = true;

  timerId = setInterval(() => {
    seconds++;
    reverseTimer--;
    displayTime.innerHTML = reverseTimer;

    if (seconds >= 60) {
      clearInterval(timerId);
      endGame();
    }
  }, 1000);
}

function stopGame() {
  clearInterval(timerId);
  isGameOn = false;
  textArea.disabled = true;
  startBtn.innerHTML = "Start Game ▶️";
  displayTime.innerText = 60;

  resultDisplayBox.style.display = "block";
  resultDisplay.innerHTML = `You stopped the game. Your typing speed is ${wordsCorrect} WPM.`;
}

function endGame() {
  isGameOn = false;
  textArea.disabled = true;
  startBtn.innerHTML = "Start Game ▶️";

  resultDisplayBox.style.display = "block";
  resultDisplay.innerHTML = `Time's up! Your typing speed is ${wordsCorrect} WPM.`;
}

// ✅ FIXED INPUT LOGIC
textArea.addEventListener("input", () => {
  if (!isGameOn) return;

  const userInput = textArea.value;

  if (userInput.endsWith(" ")) {
    const typedWords = userInput.trim().split(/\s+/);
    const currentTypedWord = typedWords[currentWordIndex];
    const correctWord = quoteArr[currentWordIndex];

    if (currentTypedWord === correctWord) {
      wordsCorrect++;
    }

    currentWordIndex++;

    if (currentWordIndex >= quoteArr.length) {
      loadQuote(); // Load new quote if finished
    }
  }
});

resetButton.addEventListener("click", () => {
  clearInterval(timerId);
  startGame();
  startBtn.innerHTML = "Stop Game ⛔";
  isGameOn = true;
});

closePopUpBtn.addEventListener("click", () => {
  resultDisplayBox.style.display = "none";
});

startBtn.addEventListener("click", () => {
  if (!isGameOn) {
    startBtn.innerHTML = "Stop Game ⛔";
    startGame();
  } else {
    stopGame();
  }
});
