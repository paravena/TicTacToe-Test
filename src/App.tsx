import { useReducer } from 'react';

type Player = 'X' | 'O';
type Cell = Player | '';

type State = {
  board: Cell[][];
  currentPlayer: Player;
  winner?: Player | 'Tied';
};

type Action =
  | {
      type: 'Play';
      payload: { x: number; y: number };
    }
  | {
      type: 'Reset';
    };

const initialState = (): State => ({
  board: Array(3)
    .fill(null)
    .map(() => Array<Cell>(3).fill('')),
  currentPlayer: 'X',
});

function calculateWinner(board: Cell[][], player: Player): boolean {
  const winConditions = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];
  return winConditions.some(condition =>
    condition.every(([x, y]) => board[y][x] === player),
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'Play': {
      const { x, y } = action.payload;
      if (state.board[y][x] === '') {
        const newBoard = [...state.board];
        newBoard[y][x] = state.currentPlayer;
        const nextPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
        if (calculateWinner(newBoard, state.currentPlayer)) {
          state.board = newBoard;
          state.winner = state.currentPlayer;
          return {
            ...state,
          };
        }
        state.currentPlayer = nextPlayer;
        state.board = newBoard;
        return { ...state };
      }
      return state;
    }
    case 'Reset': {
      return { ...initialState() };
    }
    default:
      throw new Error(`Unknown action type`);
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState());
  const handleClick = (x: number, y: number) =>
    dispatch({
      type: 'Play',
      payload: { x, y },
    });
  return (
    <div className="flex h-screen flex-col">
      <div className="mb-4 flex justify-center text-4xl">
        {state.winner
          ? `Winner is: ${state.winner}`
          : `Current player is: ${state.currentPlayer}`}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-200">
        {state.board.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center">
            {row.map((cell, cellIndex) => (
              <button
                key={`cell-${rowIndex}-${cellIndex}`}
                className="m-1 flex h-20 w-20 items-center justify-center border-2 border-gray-300 bg-white text-xl font-bold text-blue-500"
                onClick={() => handleClick(cellIndex, rowIndex)}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button onClick={() => dispatch({ type: 'Reset' })}>Reset</button>
      </div>
    </div>
  );
}

export default App;
