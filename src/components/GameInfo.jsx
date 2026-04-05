import React from "react";

export default function GameInfo({ time, flags, mines, gameOver, victory, bestTime }) {
  return (
    <div className="info">
      <p>⏱ Tiempo: {time}s</p>
      <p>🚩 Banderas: {flags} / {mines}</p>
      {bestTime !== null && <p>🏅 Mejor tiempo: {bestTime}s</p>}
      {gameOver && <p className="message gameover">💥 Game Over!</p>}
      {victory && <p className="message victory">🏆 ¡Ganaste en {time}s!</p>}
    </div>
  );
}