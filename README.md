# Inventory Solver

Solver “inventory management” con interfaccia web e versione Python (Tkinter).  
Permette di definire una board e un set di shape e prova a disporle automaticamente.

## 🌐 Demo (GitHub Pages)

1. Apri **https://lorenzosever.github.io/inventorysolver/**
2. Imposta il **Board Layout** (10×10 di default).
3. Disegna le **Shapes** (12 shape 4×4).
4. Clicca **Submit Shapes** per avviare il solver.

> Se il sito non si aggiorna subito dopo un commit, prova un hard refresh (Ctrl+F5 / Cmd+Shift+R).

---

## 📦 Struttura

- `index.html`, `styles.css`, `script.js` → **Web app** (GitHub Pages).
- `solver.py` → **App desktop** (Tkinter) avviabile in locale.

---

## ⚙️ Board Size (Web)

La dimensione della griglia è configurata in `script.js`:

```js
// --- configurazione ---
const BOARD_SIZE = 10; // cambia qui per 6/7/12...
