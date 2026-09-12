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
- Add stronger accessibility labels and keyboard focus states.
- Optionally move the word bank to a small backend if you later want server-controlled puzzles.
