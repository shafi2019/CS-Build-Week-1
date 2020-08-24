import React, { useState } from 'react';
import produce from 'immer';

const numRows = 60;
const numCols = 60;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
  });


  return (
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
             gridCopy[i][k] = 1;
           })
           setGrid(newGrid)
         }}
         style={{ 
           width: 12, 
           height: 12, 
           backgroundColor: grid[i][k] ? 'black' :undefined, 
           border: "solid 0.5px black",
        }} />)     
      )}
    </div>
  );
}

export default App;
