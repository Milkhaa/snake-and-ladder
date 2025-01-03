import React, { useState, useCallback } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const SnakeAndLadder = () => {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [positions, setPositions] = useState({ 1: 1, 2: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [rolling, setRolling] = useState(false);

  const snakesAndLadders = {
    16: 6,   // Snake
    47: 26,  // Snake
    49: 11,  // Snake
    56: 53,  // Snake
    62: 19,  // Snake
    87: 24,  // Snake
    98: 28,  // Snake
    4: 14,   // Ladder
    9: 31,   // Ladder
    21: 42,  // Ladder
    28: 84,  // Ladder
    36: 44,  // Ladder
    51: 67,  // Ladder
    71: 91,  // Ladder
    80: 100  // Ladder
  };

  const CELL_SIZE = 48; // w-12 = 48px
  const BOARD_SIZE = 10;

  const getCellPosition = useCallback((number) => {
    const row = Math.floor((100 - number) / 10);
    const col = row % 2 === 0 ? 9 - ((100 - number) % 10) : (100 - number) % 10;
    return {
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2
    };
  }, []);

  const renderSnakesAndLadders = useCallback(() => {
    const elements = [];
    
    // Draw Snakes
    const snakes = [
      { start: 16, end: 6 },
      { start: 47, end: 26 },
      { start: 49, end: 11 },
      { start: 56, end: 53 },
      { start: 62, end: 19 },
      { start: 87, end: 24 },
      { start: 98, end: 28 }
    ];

    snakes.forEach(({ start, end }) => {
      const startPos = getCellPosition(start);
      const endPos = getCellPosition(end);
      
      // Create snake path
      const midX = (startPos.x + endPos.x) / 2;
      const midY = (startPos.y + endPos.y) / 2;
      const controlX = midX + 20;
      const controlY = midY;

      elements.push(
        <g key={`snake-${start}`}>
          <path
            d={`M ${startPos.x} ${startPos.y} Q ${controlX} ${controlY} ${endPos.x} ${endPos.y}`}
            stroke="red"
            strokeWidth="3"
            fill="none"
          />
          {/* Snake head */}
          <circle
            cx={startPos.x}
            cy={startPos.y}
            r="4"
            fill="red"
          />
        </g>
      );
    });

    // Draw Ladders
    const ladders = [
      { start: 4, end: 14 },
      { start: 9, end: 31 },
      { start: 21, end: 42 },
      { start: 28, end: 84 },
      { start: 36, end: 44 },
      { start: 51, end: 67 },
      { start: 71, end: 91 },
      { start: 80, end: 100 }
    ];

    ladders.forEach(({ start, end }) => {
      const startPos = getCellPosition(start);
      const endPos = getCellPosition(end);
      const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
      const spacing = 5;
      
      // Create ladder sides
      const x1Offset = Math.sin(angle) * spacing;
      const y1Offset = -Math.cos(angle) * spacing;
      
      elements.push(
        <g key={`ladder-${start}`}>
          {/* Ladder sides */}
          <line
            x1={startPos.x + x1Offset}
            y1={startPos.y + y1Offset}
            x2={endPos.x + x1Offset}
            y2={endPos.y + y1Offset}
            stroke="green"
            strokeWidth="2"
          />
          <line
            x1={startPos.x - x1Offset}
            y1={startPos.y - y1Offset}
            x2={endPos.x - x1Offset}
            y2={endPos.y - y1Offset}
            stroke="green"
            strokeWidth="2"
          />
          {/* Ladder rungs */}
          {[...Array(5)].map((_, i) => {
            const t = (i + 1) / 6;
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
    });

    return elements;
  }, [getCellPosition]);

  const rollDice = () => {
    if (rolling || gameOver) return;
    
    setRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setDiceValue(roll);
      movePlayer(roll);
      setRolling(false);
    }, 1000);
  };

  const movePlayer = (roll) => {
    const newPosition = positions[currentPlayer] + roll;
    
    if (newPosition > 100) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      return;
    }

    const finalPosition = snakesAndLadders[newPosition] || newPosition;
    
    setPositions(prev => ({
      ...prev,
      [currentPlayer]: finalPosition
    }));

    if (finalPosition === 100) {
      setGameOver(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const resetGame = () => {
    setCurrentPlayer(1);
    setDiceValue(1);
    setPositions({ 1: 1, 2: 1 });
    setGameOver(false);
  };

  const DiceIcon = {
    1: Dice1,
    2: Dice2,
    3: Dice3,
    4: Dice4,
    5: Dice5,
    6: Dice6
  }[diceValue];

  const renderBoard = () => {
    const cells = [];
    let number = 100;
    
    for (let row = 0; row < 10; row++) {
      const rowCells = [];
      for (let col = 0; col < 10; col++) {
        const isEvenRow = row % 2 === 0;
        const cellNumber = isEvenRow ? number - col : number - 9 + col;
        const position = cellNumber;
        
        rowCells.push(
          <div 
            key={position} 
            className={`w-12 h-12 border border-gray-300 flex items-center justify-center relative
              ${snakesAndLadders[position] ? 'bg-yellow-100' : 'bg-white'}
            `}
          >
            <span className="text-xs absolute top-0 left-1">{position}</span>
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

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <h1 className="text-3xl font-bold">Snake and Ladder</h1>
      
      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <div className="border-2 rounded p-4 relative">
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
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className="text-xl font-semibold">
            Player {currentPlayer}'s Turn
          </div>
          
          <div className="p-4 border-2 rounded">
            <DiceIcon size={48} className={rolling ? 'animate-spin' : ''} />
          </div>

          <button
            onClick={rollDice}
            disabled={rolling || gameOver}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Roll Dice
          </button>

          {gameOver && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-xl font-bold text-green-600">
                Player {currentPlayer} Wins!
              </div>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Play Again
              </button>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div>Player 1: Position {positions[1]}</div>
            <div>Player 2: Position {positions[2]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeAndLadder;