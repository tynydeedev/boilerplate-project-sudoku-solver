const _ = require('lodash');

class SudokuSolver {

  validate(puzzleString) {
    const string = puzzleString;
    const validLength = 81;
    const invalidRegexCheck = /[^1-9\.]/.test(string);
    if (string.length !== validLength) return 'invalid length';
    if (invalidRegexCheck) return 'invalid character';
    return 'valid';
  }

  createMap(puzzleString) {
    const string = puzzleString;
    const nodes = string.split('');
    let map = [];
    let i = 9;
    while (i <= nodes.length) {
      map.push(nodes.splice(0, i));
    }
    return map;
  }

  checkRowPlacement(puzzleMap, row, column, value) {
    // NOTE: value is a string, not a number
    if (puzzleMap[row].indexOf(value) >= 0) return false;
    return true;
  }

  checkColPlacement(puzzleMap, row, column, value) {
    for (let i = 0; i < puzzleMap.length; i++) {
      if (puzzleMap[i][column] === value) return false;
    };
    return true;
  }

  checkRegionPlacement(puzzleMap, row, column, value) {
    const rowStart = row - (row % 3);
    const columnStart = column - (column % 3);
    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = columnStart; j < columnStart + 3; j++) {
        if (puzzleMap[i][j] === value) return false;
      }
    }
    return true;
  }

  solve(puzzleMap) {
    // the position of the first empty node
    let emptyPos = {
      x: -1,
      y: -1
    };
    // Loop to find the first empty node and get the position
    rowLoop:
    for (let row = 0; row < 9; row++) {
      nodeLoop:
      for (let node = 0; node < 9; node++) {
        if (puzzleMap[row][node] === '.') {
          emptyPos.y = row;
          emptyPos.x = node;
          break rowLoop;
        }
      }
    };
    // if there are no empty position, return
    if (emptyPos.x === -1) {
      for(let row = 0; row < 9; row++) {
        for(let node = 0; node < 9; node++) {
          let value = puzzleMap[row][node];
          puzzleMap[row][node] = 0;
          const checkRow = this.checkRowPlacement(puzzleMap, row, node, value);
          const checkCol = this.checkColPlacement(puzzleMap, row, node, value);
          const checkRegion = this.checkRegionPlacement(puzzleMap, row, node, value);
          if (!checkRow || !checkCol || !checkRegion) {
            return false;
          }
          puzzleMap[row][node] = value;
        }
      }
      return true;
    };
    // if there are empty position, use backtracking to solve
    for (let value = 1; value < 10; value++) {
      const stringValue = value.toString();
      const checkRow = this.checkRowPlacement(puzzleMap, emptyPos.y, emptyPos.x, stringValue);
      const checkCol = this.checkColPlacement(puzzleMap, emptyPos.y, emptyPos.x, stringValue);
      const checkRegion = this.checkRegionPlacement(puzzleMap, emptyPos.y, emptyPos.x, stringValue);
      if (checkRow && checkCol && checkRegion) {
        puzzleMap[emptyPos.y][emptyPos.x] = stringValue;
        if (this.solve(puzzleMap)) {
          return true;
        }
        puzzleMap[emptyPos.y][emptyPos.x] = '.';
      }
    }
    return false;
  };

  print(puzzleString) {
    if (
      this.validate(puzzleString) === 'invalid length' ||
      this.validate(puzzleString) === 'invalid character'
    ) return this.validate(puzzleString);

    let map = this.createMap(puzzleString);
    const result = this.solve(map);
    if (result) {
      return _.flattenDeep(map).join('');
    } else {
      return 'Cannot solve';
    }
  }
}

module.exports = SudokuSolver;