import React, { useState, useEffect } from "react";
import Cell from "./Cell";

export default function Board({
  rows,
  cols,
  mines,
  setGameOver,
  setVictory,
  flags,
  setFlags,
  setTimerActive,
}) {
  const [board, setBoard] = useState([]);

  // Generar tablero con minas
  useEffect(() => {
    const newBoard = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols).fill({
          isMine: false,
          isOpen: false,
          isFlagged: false,
          adjacentMines: 0,
        })
      );

    // Colocar minas aleatorias
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c] = { ...newBoard[r][c], isMine: true };
        minesPlaced++;
      }
    }

    // Contar minas adyacentes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (
                r + i >= 0 &&
                r + i < rows &&
                c + j >= 0 &&
                c + j < cols &&
                newBoard[r + i][c + j].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[r][c] = { ...newBoard[r][c], adjacentMines: count };
        }
      }
    }

    setBoard(newBoard);
  }, [rows, cols, mines]);

  const revealCell = (r, c, newBoard) => {
    if (newBoard[r][c].isOpen || newBoard[r][c].isFlagged) return;
    newBoard[r][c].isOpen = true;

    if (newBoard[r][c].isMine) {
      setGameOver(true);
      // Revelar todas las minas
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newBoard[i][j].isMine) newBoard[i][j].isOpen = true;
        }
      }
      setBoard([...newBoard]);
      return;
    }

    // Si es 0, revelar recursivamente
    if (newBoard[r][c].adjacentMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            r + i >= 0 &&
            r + i < rows &&
            c + j >= 0 &&
            c + j < cols
          ) {
            revealCell(r + i, c + j, newBoard);
          }
        }
      }
    }
  };

  const handleClick = (r, c) => {
    setTimerActive(true);
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    revealCell(r, c, newBoard);
    setBoard(newBoard);
    checkVictory(newBoard);
  };

  const handleRightClick = (r, c, e) => {
    e.preventDefault();
    if (board[r][c].isOpen) return;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
    setFlags((prev) => prev + (newBoard[r][c].isFlagged ? 1 : -1));
    checkVictory(newBoard);
  };

  const checkVictory = (board) => {
    let won = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!board[r][c].isMine && !board[r][c].isOpen) {
          won = false;
        }
      }
    }
    if (won) setVictory(true);
  };

  return (
    <div
      id="board"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <Cell
            key={`${rIdx}-${cIdx}`}
            cell={cell}
            row={rIdx}
            col={cIdx}
            onClick={handleClick}
            onRightClick={handleRightClick}
          />
        ))
      )}
    </div>
  );
}