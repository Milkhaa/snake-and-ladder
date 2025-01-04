import React, { useState } from 'react';
import Board from './Board';

const Game = () => {
  const [positions, setPositions] = useState({ 1: 1, 2: 1 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const moves = {
    // Snakes
    98: 28,
    95: 75,
    93: 73,
    87: 24,
    64: 60,
    62: 19,
    54: 34,
    17: 7,
    
    // Ladders
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    51: 67,
    72: 91,
    80: 99
  };

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

    const finalPosition = moves[newPosition] || newPosition;
    
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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Snake and Ladder</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        <Board 
          positions={positions}
          moves={moves}
          diceValue={diceValue}
          rolling={rolling}
          onRoll={rollDice}
          currentPlayer={currentPlayer}
          gameOver={gameOver}
          onReset={resetGame}
        />
      </div>
    </div>
  );
};

export default Game;