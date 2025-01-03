import React, { useState, useCallback } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const SnakeAndLadder = () => {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [positions, setPositions] = useState({ 1: 1, 2: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [rolling, setRolling] = useState(false);

  const CELL_SIZE = 48;
  const BOARD_SIZE = 10;

  // Update snakes and ladders positions to match the visuals
  const snakesAndLadders = {
    // Snakes
    99: 78,
    95: 75,
    87: 24,
    62: 19,
    54: 34,
    17: 7,
    
    // Ladders
    4: 14,
    9: 31,
    20: 38,
    28: 84,
    40: 59,
    51: 67,
    63: 81,
    71: 91
  };

  // ... rest of the component code remains the same