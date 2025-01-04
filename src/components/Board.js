import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const Board = ({ positions, moves, diceValue, rolling, onRoll, currentPlayer, gameOver, onReset }) => {
  const CELL_SIZE = 60;
  const BOARD_SIZE = 10;

  const DiceIcon = {
    1: Dice1, 2: Dice2, 3: Dice3,
    4: Dice4, 5: Dice5, 6: Dice6
  }[diceValue];

  const getRowCol = (number) => {
    const adjustedNumber = 100 - number;
    const row = Math.floor(adjustedNumber / 10);
    const col = row % 2 === 0 
      ? adjustedNumber % 10 
      : 9 - (adjustedNumber % 10);
    return { row, col };
  };

  const getCellCenter = (number) => {
    const { row, col } = getRowCol(number);
    return {
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2
    };
  };

  const renderBoard = () => {
    const cells = [];
    let number = 100;
    
    for (let row = 0; row < 10; row++) {
      const rowCells = [];
      for (let col = 0; col < 10; col++) {
        const isEvenRow = row % 2 === 0;
        const position = isEvenRow ? number - col : number - 9 + col;

        rowCells.push(
          <div 
            key={position} 
            className={`w-[60px] h-[60px] border border-gray-300 flex items-center justify-center relative
              ${moves[position] < position ? 'bg-red-100' : ''}
              ${moves[position] > position ? 'bg-green-100' : ''}
              ${!moves[position] ? 'bg-white' : ''}
            `}
          >
            <span className="text-xs absolute top-1 left-1">{position}</span>
            {positions[1] === position && (
              <div className="w-4 h-4 rounded-full bg-blue-500 absolute" />
            )}
            {positions[2] === position && (
              <div className="w-4 h-4 rounded-full bg-red-500 absolute" />
            )}
          </div>
        );
      }
      cells.push(
        <div key={row} className="flex">
          {rowCells}
        </div>
      );
      number -= 10;
    }
    return cells;
  };

  const renderSnakesAndLadders = () => {
    return (
      <>
        {Object.entries(moves).map(([start, end]) => {
          const startPos = getCellCenter(parseInt(start));
          const endPos = getCellCenter(parseInt(end));
          
          if (end < start) {
            // Snake
            const midX = (startPos.x + endPos.x) / 2;
            const midY = (startPos.y + endPos.y) / 2;
            const controlX = startPos.x < endPos.x ? midX + 30 : midX - 30;

            return (
              <g key={`snake-${start}`}>
                <path
                  d={`M ${startPos.x} ${startPos.y} Q ${controlX} ${midY} ${endPos.x} ${endPos.y}`}
                  stroke="red"
                  strokeWidth="3"
                  fill="none"
                />
                <circle cx={startPos.x} cy={startPos.y} r="4" fill="darkred" />
                <circle cx={endPos.x} cy={endPos.y} r="3" fill="red" />
              </g>
            );
          } else {
            // Ladder
            const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
            const spacing = 6;
            const x1Offset = Math.sin(angle) * spacing;
            const y1Offset = -Math.cos(angle) * spacing;
            
            const dist = Math.sqrt(
              Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
            );
            const rungs = Math.max(2, Math.floor(dist / 40));

            return (
              <g key={`ladder-${start}`}>
                <line
                  x1={startPos.x + x1Offset}
                  y1={startPos.y + y1Offset}
                  x2={endPos.x + x1Offset}
                  y2={endPos.y + y1Offset}
                  stroke="green"
                  strokeWidth="3"
                />
                <line
                  x1={startPos.x - x1Offset}
                  y1={startPos.y - y1Offset}
                  x2={endPos.x - x1Offset}
                  y2={endPos.y - y1Offset}
                  stroke="green"
                  strokeWidth="3"
                />
                {[...Array(rungs)].map((_, i) => {
                  const t = (i + 1) / (rungs + 1);
                  const x = startPos.x + (endPos.x - startPos.x) * t;
                  const y = startPos.y + (endPos.y - startPos.y) * t;
                  return (
                    <line
                      key={`rung-${i}`}
                      x1={x + x1Offset}
                      y1={y + y1Offset}
                      x2={x - x1Offset}
                      y2={y - y1Offset}
                      stroke="green"
                      strokeWidth="2"
                    />
                  );
                })}
              </g>
            );
          }
        })}
      </>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="relative border-2 rounded-lg p-2 bg-white shadow-lg">
        {renderBoard()}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            width: CELL_SIZE * BOARD_SIZE,
            height: CELL_SIZE * BOARD_SIZE
          }}
        >
          {renderSnakesAndLadders()}
        </svg>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div className="text-xl font-semibold text-gray-800">
          Player {currentPlayer}'s Turn
        </div>
        
        <div className="p-4 border-2 rounded-lg bg-white">
          <DiceIcon size={48} className={rolling ? 'animate-spin' : ''} />
        </div>

        <button
          onClick={onRoll}
          disabled={rolling || gameOver}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
        >
          Roll Dice
        </button>

        {gameOver && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-xl font-bold text-green-600">
              Player {currentPlayer} Wins!
            </div>
            <button
              onClick={onReset}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-4 space-y-2 text-gray-800">
          <div>Player 1: Position {positions[1]}</div>
          <div>Player 2: Position {positions[2]}</div>
        </div>
      </div>
    </div>
  );
};

export default Board;