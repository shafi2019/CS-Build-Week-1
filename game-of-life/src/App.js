import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';

/* The Immer package exposes a default function that does all the work.
produce(currentState, producer: (draftState) => void): nextState
The interesting thing about Immer is that the baseState will be untouched, 
but the nextState will reflect all changes made to draftState. 

The produce function takes two arguments. The currentState and a producer function. 
The current state determines our starting point, and the producer expresses what 
needs to happen to it. The producer function receives one argument, the draft, 
which is a proxy to the current state you passed in. Any modification you make to 
the draft will be recorded and used to produce nextState. The currentState will be
untouched during this process.*/

const numRows = 60;
const numCols = 60;

// This is Arry of operations so to make our job easy to compute neighbors
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptryGrid = () => {
  const rows = [];
  // for loop for the number of rows
  for (let i = 0; i < numRows; i++) {
    // push a columns, generate an Array and numCols is the lenght of Array and all the values will be 0
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptryGrid()
  });
  
  // storing in state if it's running and not and by default it's false
  const [running, setRunning] = useState(false);

  // storing the value of running in Ref
  const runningRef = useRef(running);
  // the current value of Ref is whatever the current value of running is.
  runningRef.current = running

   // I would like this function to not change to do that I am using useCallback hook
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    // current value of grid is g
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          // the double for loop will go through every single cell
          for (let k = 0; k < numCols; k++) {
            // compute the number of neighbors
            let neighbors = 0;
                               // each one gonna have x and y
            operations.forEach(([x, y]) => {
              // compute new i
              const newI = i + x;
              // compute new k
              const newK = k + y;
              // checking the bonds to make sure we didn't go below or above what we can 
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                            
                neighbors += g[newI][newK]
              }
            })
           
            if (neighbors < 2 || neighbors > 3) {
              // our current grid positions die 
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 200)
  }, []);

  return (
    <div
      style={{
        margin: 20,
        backgroundColor: 'cornsilk',
        width: '62%'
      }}
    >
      <h1
        style={{
          margin: 20,
          width: '100%',
          fontFamily: 'Monospace',
          fontSize: '38px'
        }}
      >{running ? 'Shafi Game of live is running now. . . . .' : 'Shafi Game of live'}</h1>
      <button
        style={{
          margin: 20,
          backgroundColor: '#000099',
          color: 'honeyDew',
          padding: 5,
          width: 100,
          borderRadius: 8,
          border: 'solid 1px honeyDew',
          fontSize: 16,
        }}
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
        // if it's running so show the Value of Stop in the button otherwise show start
      >{running ? 'Stop' : 'Start'}</button>
      <button
        style={{
          marginRight: 20,
          backgroundColor: '#000099',
          color: 'honeyDew',
          padding: 5,
          width: 100,
          borderRadius: 8,
          border: 'solid 1px honeyDew',
          fontSize: 16,
        }}
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.random() > 0.7 ? 1 : 0));
          }

          setGrid(rows);
        }}
      >
        Random
      </button>
      <button
        style={{
          backgroundColor: '#000099',
          color: 'honeyDew',
          padding: 5,
          width: 100,
          borderRadius: 8,
          border: 'solid 1px honeyDew',
          fontSize: 16,
        }}
        onClick={() => {
          setGrid(generateEmptryGrid())
        }}
      >
        Clear
      </button>
      <div style={{
        marginLeft: 20,
        display: 'grid',
        // it's an property
        gridTemplateColumns: `repeat(${numCols}, 15px)`
      }}>
        {grid.map((rows, i) =>
                  // rows index
          rows.map((col, k) =>
                  // columns index
            <div
            // uniqe key
              key={`${i}-${k}`}
              onClick={() => {
                // update the new grid using produce 
                const newGrid = produce(grid, gridCopy => {
                                   // if it's currently alive we can make it dead 
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                })
                setGrid(newGrid)
              }}
              style={{
                width: 15,
                height: 15,
                backgroundColor: grid[i][k] ? 'black' : undefined,
                border: "solid 0.5px black",
              }} />)
        )}
      </div>
    </div>
  );
}

export default App;


