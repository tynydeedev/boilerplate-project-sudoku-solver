const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

const coordinateConverter = (row, col) => {
  switch (row) {
    case 0:
      row = 'A';
      break;
    case 1:
      row = 'B';
      break;
    case 2:
      row = 'C';
      break;
    case 3:
      row = 'D';
      break;
    case 4:
      row = 'E';
      break;
    case 5:
      row = 'F';
      break;
    case 6:
      row = 'G';
      break;
    case 7:
      row = 'H';
      break;
    case 8:
      row = 'I';
      break; 
  }
  col = (col + 1).toString();
  return row + col;
}

const valueFinder = (puzzleString, numberOfConflict) => {
  const map = solver.createMap(puzzleString);
  console.log(puzzleString);
  let value;
  let pos;
  let conflict;
  // find the first empty node
  rowLoop:
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if (map[i][j] === '.') {
        // Find the coordinate of the empty node
        pos = coordinateConverter(i, j);
        // Test for the number that satisfies the conflict requirement
        for(let k = 1; k < 10; k++) {
          k = k.toString();
          // Determine the conflicts
          switch(numberOfConflict) {
            case 0:
              conflict = solver.checkRowPlacement(map, i, j, k) && solver.checkColPlacement(map, i, j, k) && solver.checkRegionPlacement(map, i, j, k);
              break;
            case 1:
              conflict = !solver.checkRowPlacement(map, i, j, k) && solver.checkColPlacement(map, i, j, k) && solver.checkRegionPlacement(map, i, j, k);
              break;
            case 2:
              conflict = !solver.checkRowPlacement(map, i, j, k) && !solver.checkColPlacement(map, i, j, k) && solver.checkRegionPlacement(map, i, j, k);
              break;
            case 3:
              conflict = !solver.checkRowPlacement(map, i, j, k) && !solver.checkColPlacement(map, i, j, k) && !solver.checkRegionPlacement(map, i, j, k);
              break;
          };
          if (conflict) {
            value = k;
            break rowLoop;
          };
        }
      }
    }
  };

  // return value and coordinate
  return {
    value: value,
    coordinate: pos
  }
}

module.exports = { valueFinder }