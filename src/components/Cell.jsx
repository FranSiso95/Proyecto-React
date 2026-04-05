import React from "react";

export default function Cell({ cell, row, col, onClick, onRightClick }) {
  let className = "cell";
  if (cell.isOpen) className += " open";
  if (cell.isMine && cell.isOpen) className += " mine";
  if (cell.isFlagged) className += " flag";

  return (
    <div
      className={className}
      data-adjacent={cell.adjacentMines}
      onClick={() => onClick(row, col)}
      onContextMenu={(e) => onRightClick(row, col, e)}
    >
      {cell.isOpen && !cell.isMine && cell.adjacentMines > 0
        ? cell.adjacentMines
        : cell.isMine && cell.isOpen
        ? "💣"
        : cell.isFlagged
        ? "🚩"
        : ""}
    </div>
  );
}