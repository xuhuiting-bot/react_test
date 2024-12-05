import React, { useState } from 'react';

// 五子棋单个格子组件（Square）
function Square({ value, onSquareClick }) {
  return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
  );
}

// 五子棋棋盘组件（Board），添加和棋判断逻辑后的版本
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner === 'X'? '黑子获胜' : '白子获胜';
  } else {
    const isFullBoard = squares.filter(square => square).length === squares.length;
    if (isFullBoard) {
      status = '和棋';
    } else {
      status = xIsNext? '轮到黑子落子' : '轮到白子落子';
    }
  }

  return (
      <>
        <div className="status">{status}</div>
        {Array.from({ length: 15 }).map((_, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {Array.from({ length: 15 }).map((_, colIndex) => {
                const index = rowIndex * 15 + colIndex;
                return (
                    <Square
                        key={index}
                        value={squares[index]}
                        onSquareClick={() => handleClick(index)}
                    />
                );
              })}
            </div>
        ))}
      </>
  );
}

// 游戏主组件（Game）
export default function Game() {
  const [history, setHistory] = useState([Array(225).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 悔棋功能函数定义
  function undoMove() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  }

  // 重新开始游戏功能函数定义
  function restartGame() {
    setHistory([Array(225).fill(null)]);
    setCurrentMove(0);
  }

  function giveUp() {
    const winner = xIsNext? 'O' : 'X'; // 根据当前轮到的玩家，确定对方获胜
    alert(`${winner} 方获胜，因为对方认输了！`);
    restartGame(); // 调用重新开始函数，重置游戏状态
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '跳到第' + move + '步';
    } else {
      description = '回到游戏开始';
    }
    return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
    );
  });

  return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <button onClick={restartGame}>重新开始</button>
          <button onClick={undoMove}>悔棋</button>
          <button onClick={giveUp}>认输</button>
          <ol>{moves}</ol>
        </div>
      </div>
  );
}

// 判断五子棋胜利的函数（calculateWinner）
function calculateWinner(squares) {
  const boardSize = 15;
  // 判断水平方向
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col <= boardSize - 5; col++) {
      const startIndex = row * boardSize + col;
      for (let i = 0; i < 5; i++) {
        if (!squares[startIndex + i]) {
          break;
        }
        if (i === 4 && squares[startIndex] === squares[startIndex + i]) {
          return squares[startIndex];
        }
      }
    }
  }
  // 判断垂直方向
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row <= boardSize - 5; row++) {
      const startIndex = row * boardSize + col;
      for (let i = 0; i < 5; i++) {
        if (!squares[startIndex + i * boardSize]) {
          break;
        }
        if (i === 4 && squares[startIndex] === squares[startIndex + i * boardSize]) {
          return squares[startIndex];
        }
      }
    }
  }
  // 判断正斜向（从左上角到右下角）
  for (let row = 0; row <= boardSize - 5; row++) {
    for (let col = 0; col <= boardSize - 5; col++) {
      const startIndex = row * boardSize + col;
      for (let i = 0; i < 5; i++) {
        if (!squares[startIndex + i * (boardSize + 1)]) {
          break;
        }
        if (i === 4 && squares[startIndex] === squares[startIndex + i * (boardSize + 1)]) {
          return squares[startIndex];
        }
      }
    }
  }
  // 判断反斜向（从右上角到左下角）
  for (let row = 0; row <= boardSize - 5; row++) {
    for (let col = 4; col < boardSize; col++) {
      const startIndex = row * boardSize + col;
      for (let i = 0; i < 5; i++) {
        if (!squares[startIndex - i * (boardSize - 1)]) {
          break;
        }
        if (i === 4 && squares[startIndex] === squares[startIndex - i * (boardSize - 1)]) {
          return squares[startIndex];
        }
      }
    }
  }
  return null;
}