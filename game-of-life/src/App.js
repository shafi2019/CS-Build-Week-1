import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';

const numRows = 60;
const numCols = 60;

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


function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
  });
  
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running
  
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK] 
              }
            })

            if (neighbors < 2 || neighbors > 3) {
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
    <>
      <button
      style={{
        margin: 20,
        marginBottom: 3,
        backgroundColor: 'green',
        color: 'yellow'
      }}
      onClick={() => {
        setRunning(!running);
        if (!running) {
          runningRef.current = true;
          runSimulation();
        }
      }}
      >{running ? 'Stop' : 'Start'}</button>
      <div style={{
        margin: 20,
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 12px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) =>
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                })
                setGrid(newGrid)
              }}
              style={{
                width: 12,
                height: 12,
                backgroundColor: grid[i][k] ? 'black' : undefined,
                border: "solid 0.5px black",
              }} />)
        )}
      </div>
    </>
  );
}

export default App;
