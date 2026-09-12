# Blordle

A simple public web word game.

## How to Play

**Goal:** guess the secret word in **3 tries**.

- Every word in the bank is two words smashed together that both start with
  the same letter — for example `coolcat`, `jazzyjuice`, `headhome`. That's
  the only hint you get going in.
- Word length changes from day to day (some are short, like `xoxo`; some
  are long, like `incrediblyimportant`). The board always shows exactly as
  many tiles per row as the current word has letters.
- Type on your physical keyboard, or tap the on-screen keyboard.
- Press **Enter** (or tap the Enter key) once a row is completely filled in
  to submit that guess. **Backspace**/⌫ deletes the last letter you typed.
- After each guess, every tile is colored to show how close you were:
  - 🟩 **Green** — that letter is in the word, in the right spot.
  - 🟨 **Gold** — that letter is in the word, but in a different spot.
  - ⬜ **Gray** — that letter isn't in the word at all.
- The on-screen keyboard picks up the same coloring on each letter key, so
  you can see at a glance which letters you've already tried and how they
  did. A key only ever upgrades (gray → gold → green), never downgrades.
- You get 3 guesses total. Guess the word exactly and you win right away;
  use all 3 tries without success and the game reveals the answer.
- **One puzzle per day:** the word is chosen deterministically from
  today's calendar date (UTC), so everyone who plays on the same day gets
  the same word — no login or server needed. A new word unlocks at UTC
  midnight.
- **New game** resets your progress on today's board (handy if you want a
  clean board to try again, though it won't give you a different word
  until the next calendar day).
- **Share result** copies an emoji grid of your guesses (🟩🟨⬜) to your
  clipboard, the same way Wordle-style games do, so you can share how you
  did without spoiling the actual word.
- Tap the **?** button in the top-right any time to reopen these
  instructions in-game.

One thing worth knowing: guesses are only checked against the target
word's letters, not against a real dictionary — you can type any
letter combination of the right length and the game will score it. It
won't stop you from "guessing" nonsense words.

## What came from the original files

The notebook defines Blordle, loads `words.txt`, selects a word, gives the player 3 turns, checks guess length, marks letters as exact/present/incorrect, and reveals the answer after the final turn.

The supplied word bank contains 26 entries. It is included unchanged in `words.js` as lowercase values.

## Important design choice

The original notebook uses `random.choice(word_bank)`, which means a new random answer each time the Python program starts.

For a public "daily puzzle" experience, this version instead chooses one deterministic word from the supplied bank based on the calendar date. That means visitors get the same puzzle on the same day without needing a database or login.

## Run it locally

Open `index.html` in a browser.

For a cleaner local development setup, use VS Code's Live Server extension or any simple static HTTP server.

## Publish it publicly

This is a static site: no Python server is required.

Good options:
- GitHub Pages — excellent for a portfolio and free for public repositories.
- Netlify — very easy drag-and-drop deployment.
- Vercel — also works well for static sites.

Upload these files together:
- index.html
- style.css
- app.js
- words.js

## Next improvements for a more polished v1

- Store completed daily results so refreshes cannot reset a finished puzzle.
- Add a real "next puzzle" countdown.
- Add streak/statistics.
- Add shareable result grids.
- Add subtle tile animations.
- Add stronger accessibility labels and keyboard focus states.
- Optionally move the word bank to a small backend if you later want server-controlled puzzles.
