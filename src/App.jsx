import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import "./components/styles.css";

export default function App() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [mines, setMines] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [boardKey, setBoardKey] = useState(0); // Para reiniciar
  const [bestTime, setBestTime] = useState(null);

  const boardId = `${rows}x${cols}x${mines}`; // identificador único

  // Leer mejor tiempo al cambiar tamaño/minas
  useEffect(() => {
    const saved = localStorage.getItem(`bestTime_${boardId}`);
    if (saved) setBestTime(Number(saved));
    else setBestTime(null);
  }, [boardId]);

  // Timer
  useEffect(() => {
    let interval;
    if (timerActive && !gameOver && !victory) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameOver, victory]);

  // Guardar mejor tiempo si gana
  useEffect(() => {
    if (victory) {
      const currentBest = localStorage.getItem(`bestTime_${boardId}`);
      if (!currentBest || time < Number(currentBest)) {
        localStorage.setItem(`bestTime_${boardId}`, time);
        setBestTime(time);
      }
    }
  }, [victory, time, boardId]);

  const handleRestart = () => {
    setGameOver(false);
    setVictory(false);
    setFlags(0);
    setTime(0);
    setTimerActive(false);
    setBoardKey((k) => k + 1);
  };

  return (
    <div className="app">
      <h1>🎯 Buscaminas Fran Style</h1>

      <div className="controls">
        <label>
          Filas:
          <input
            type="number"
            min="5"
            max="20"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </label>
        <label>
          Columnas:
          <input
            type="number"
            min="5"
            max="20"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
          />
        </label>
        <label>
          Minas:
          <input
            type="number"
            min="1"
            max={rows * cols - 1}
            value={mines}
            onChange={(e) => setMines(Number(e.target.value))}
          />
        </label>
        <button onClick={handleRestart}>🔄 Reiniciar</button>
      </div>

      {/* Info modularizada */}
      <GameInfo
        time={time}
        flags={flags}
        mines={mines}
        gameOver={gameOver}
        victory={victory}
        bestTime={bestTime}
      />

      <Board
        key={boardKey}
        rows={rows}
        cols={cols}
        mines={mines}
        setGameOver={setGameOver}
        setVictory={setVictory}
        flags={flags}
        setFlags={setFlags}
        setTimerActive={setTimerActive}
      />
    </div>
  );
}