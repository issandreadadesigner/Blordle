const MAX_TURNS = 3;
const STORAGE_KEY = "blordle-state-v1";

const board = document.querySelector("#board");
const keyboard = document.querySelector("#keyboard");
const message = document.querySelector("#message");
const dateLabel = document.querySelector("#dateLabel");
const newGameButton = document.querySelector("#newGameButton");
const shareButton = document.querySelector("#shareButton");
const helpButton = document.querySelector("#helpButton");
const helpDialog = document.querySelector("#helpDialog");
const closeHelp = document.querySelector("#closeHelp");

let target = "";
let rowIndex = 0;
let currentGuess = "";
let gameOver = false;
let evaluations = [];

function dateKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyIndex() {
  // Simple deterministic day number; no server or database required.
  const start = Date.UTC(2026, 0, 1);
  const today = Date.parse(dateKey() + "T00:00:00Z");
  const days = Math.floor((today - start) / 86400000);
  return ((days % WORD_BANK.length) + WORD_BANK.length) % WORD_BANK.length;
}

function getTarget() {
  return WORD_BANK[getDailyIndex()];
}

function buildBoard() {
  board.innerHTML = "";
  board.style.gridTemplateRows = `repeat(${MAX_TURNS}, 1fr)`;

  for (let r = 0; r < MAX_TURNS; r++) {
    const row = document.createElement("div");
    row.className = "row";
    row.style.gridTemplateColumns = `repeat(${target.length}, minmax(0, 1fr))`;
    row.dataset.row = r;

    for (let c = 0; c < target.length; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.col = c;
      tile.setAttribute("aria-label", `Row ${r + 1}, letter ${c + 1}`);
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

const keyRows = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["enter","z","x","c","v","b","n","m","backspace"]
];

function buildKeyboard() {
  keyboard.innerHTML = "";
  keyRows.forEach(row => {
    row.forEach(keyValue => {
      const button = document.createElement("button");
      button.className = "key" + (keyValue.length > 1 ? " wide" : "");
      button.type = "button";
      button.textContent =
        keyValue === "backspace" ? "⌫" :
        keyValue === "enter" ? "Enter" : keyValue;
      button.dataset.key = keyValue;
      button.addEventListener("click", () => handleKey(keyValue));
      keyboard.appendChild(button);
    });
  });
}

function renderCurrentGuess() {
  const row = board.children[rowIndex];
  [...row.children].forEach((tile, i) => {
    tile.textContent = currentGuess[i] || "";
    tile.classList.toggle("filled", Boolean(currentGuess[i]));
  });
}

function evaluateGuess(guess) {
  const result = Array(target.length).fill("absent");
  const remaining = target.split("");

  // Exact matches first.
  for (let i = 0; i < target.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      remaining[i] = null;
    }
  }

  // Then misplaced letters.
  for (let i = 0; i < target.length; i++) {
    if (result[i] === "correct") continue;
    const found = remaining.indexOf(guess[i]);
    if (found !== -1) {
      result[i] = "present";
      remaining[found] = null;
    }
  }

  return result;
}

function paintGuess(guess, result) {
  const row = board.children[rowIndex];
  [...row.children].forEach((tile, i) => {
    tile.textContent = guess[i];
    tile.classList.add(result[i]);
  });

  guess.split("").forEach((letter, i) => updateKey(letter, result[i]));
}

function updateKey(letter, status) {
  const button = keyboard.querySelector(`[data-key="${CSS.escape(letter)}"]`);
  if (!button) return;

  // Never downgrade a stronger result.
  if (button.classList.contains("correct")) return;
  if (button.classList.contains("present") && status === "absent") return;

  button.classList.remove("absent", "present");
  button.classList.add(status);
}

function submitGuess() {
  if (gameOver) return;

  if (currentGuess.length !== target.length) {
    setMessage(`Please enter a ${target.length}-letter word.`);
    return;
  }

  const result = evaluateGuess(currentGuess);
  paintGuess(currentGuess, result);
  evaluations.push(result);
  rowIndex++;

  if (currentGuess === target) {
    gameOver = true;
    setMessage("Congratulations! You got it.");
    saveState();
    return;
  }

  if (rowIndex === MAX_TURNS) {
    gameOver = true;
    setMessage(`Not quite. The answer was ${target.toUpperCase()}.`);
    saveState();
    return;
  }

  currentGuess = "";
  setMessage(`${MAX_TURNS - rowIndex} ${MAX_TURNS - rowIndex === 1 ? "try" : "tries"} left.`);
  saveState();
}

function handleKey(key) {
  if (gameOver) return;

  if (key === "enter") {
    submitGuess();
    return;
  }

  if (key === "backspace") {
    currentGuess = currentGuess.slice(0, -1);
    renderCurrentGuess();
    return;
  }

  if (/^[a-z]$/.test(key) && currentGuess.length < target.length) {
    currentGuess += key;
    renderCurrentGuess();
  }
}

function setMessage(text) {
  message.textContent = text;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    date: dateKey(),
    target,
    rowIndex,
    currentGuess,
    gameOver,
    evaluations
  }));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || saved.date !== dateKey() || saved.target !== target) return false;

    rowIndex = saved.rowIndex || 0;
    currentGuess = saved.currentGuess || "";
    gameOver = Boolean(saved.gameOver);
    evaluations = saved.evaluations || [];

    evaluations.forEach((result, i) => {
      const row = board.children[i];
      // Recover the original guess from the stored tile letters.
      const guess = [...row.children].map(tile => tile.textContent).join("");
      // If no guess was persisted separately, this loop is intentionally skipped.
    });

    return true;
  } catch {
    return false;
  }
}

function resetGame() {
  localStorage.removeItem(STORAGE_KEY);
  rowIndex = 0;
  currentGuess = "";
  gameOver = false;
  evaluations = [];
  start();
}

function start() {
  target = getTarget();
  buildBoard();
  buildKeyboard();
  dateLabel.textContent = `Puzzle for ${new Date().toLocaleDateString(undefined, {year:"numeric", month:"long", day:"numeric"})}`;
  setMessage("Good luck!");
  loadState();
  renderCurrentGuess();
}

document.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const key = event.key.toLowerCase();
  if (key === "enter" || key === "backspace" || /^[a-z]$/.test(key)) {
    event.preventDefault();
    handleKey(key);
  }
});

newGameButton.addEventListener("click", resetGame);

shareButton.addEventListener("click", async () => {
  const blocks = evaluations.map(result =>
    result.map(status => status === "correct" ? "🟩" : status === "present" ? "🟨" : "⬜").join("")
  ).join("\n");

  const text = `Blordle ${dateKey()}\n${blocks || "No guesses yet."}`;

  try {
    await navigator.clipboard.writeText(text);
    setMessage("Result copied to clipboard.");
  } catch {
    setMessage(text);
  }
});

helpButton.addEventListener("click", () => helpDialog.showModal());
closeHelp.addEventListener("click", () => helpDialog.close());

start();
