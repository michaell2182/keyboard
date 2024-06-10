const keys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const timestamps = [];
let correctHitsInARow = 0;
let delay = 1000; // initial delay in milliseconds
const defaultDelay = 1000;
let gameInterval;
let gameDuration = 60 * 1000; // 1 minute in milliseconds
let startTime;
let correctKeyPresses = 0;
let totalKeyPresses = 0;

timestamps.unshift(getTimestamp());

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomKey() {
  return keys[getRandomNumber(0, keys.length - 1)];
}

function targetRandomKey() {
  setTimeout(() => {
    const previousKey = document.querySelector(".selected");
    if (previousKey) {
      previousKey.classList.remove("selected");
    }

    const key = document.getElementById(getRandomKey());
    key.classList.add("selected");
  }, delay);
}

function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

function calculateAccuracy() {
  return Math.round((correctKeyPresses / totalKeyPresses) * 100);
}

function endGame() {
  clearInterval(gameInterval);
  const accuracy = calculateAccuracy();
  document.getElementById("total-keys").innerText = totalKeyPresses;
  document.getElementById("accuracy-score").innerText = accuracy;
  document.getElementById("wpm-popover").style.display = "block";
}

function updateCountdown() {
  const elapsed = Date.now() - startTime;
  const remainingTime = Math.max(0, gameDuration - elapsed);
  const seconds = Math.floor(remainingTime / 1000);
  document.getElementById("countdown-timer").innerText = seconds;
  if (remainingTime <= 0) {
    endGame();
  }
}

function startGame() {
  startTime = Date.now();
  targetRandomKey();
  gameInterval = setInterval(updateCountdown, 1000);
}

document.addEventListener("keyup", (event) => {
  const keyPressed = String.fromCharCode(event.keyCode);
  const keyElement = document.getElementById(keyPressed);
  const highlightedKey = document.querySelector(".selected");

  keyElement.classList.add("hit");
  keyElement.addEventListener("animationend", () => {
    keyElement.classList.remove("hit");
  });

  totalKeyPresses += 1;

  if (keyPressed === highlightedKey.innerHTML) {
    correctKeyPresses += 1;
    timestamps.unshift(getTimestamp());
    highlightedKey.classList.remove("selected");

    correctHitsInARow += 1;
    if (correctHitsInARow >= 5) {
      delay = Math.max(200, delay - 100); // decrease delay, but not below 200ms
    }

    targetRandomKey();
  } else {
    correctHitsInARow = 0;
    delay = defaultDelay;
  }
});

// Event listener for restart button
document.getElementById("restart-btn").addEventListener("click", () => {
  document.getElementById("wpm-popover").style.display = "none";
  timestamps.length = 0;
  timestamps.unshift(getTimestamp());
  correctHitsInARow = 0;
  delay = defaultDelay;
  correctKeyPresses = 0;
  totalKeyPresses = 0;
  startGame();
});

// Start the game initially
startGame();
