# Blordle

A simple public web version word game.

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

