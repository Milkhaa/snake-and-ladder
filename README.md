# Snake and Ladder Game

A web-based implementation of the classic Snake and Ladder board game built with React.

## Features

- Interactive game board with 100 cells
- Two-player turn-based gameplay
- Animated dice rolls
- Snakes and ladders with automatic position updates
- Game state tracking
- Responsive design

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Game Rules

1. Players start from position 1
2. Players take turns rolling the dice
3. Move your token according to the dice value
4. Landing on a ladder takes you up
5. Landing on a snake takes you down
6. First player to reach exactly 100 wins
7. Must roll the exact number needed to reach 100

## Snakes and Ladders Positions

Snakes (Head → Tail):
- 16 → 6
- 47 → 26
- 49 → 11
- 56 → 53
- 62 → 19
- 87 → 24
- 98 → 28

Ladders (Bottom → Top):
- 4 → 14
- 9 → 31
- 21 → 42
- 28 → 84
- 36 → 44
- 51 → 67
- 71 → 91
- 80 → 100