'use strict';

const coorConverter = require('../utils/api-utils.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      console.log(req.body);

      if (!puzzle || !coordinate || !value) return res.json({ error: 'Required field(s) missing' });

      switch(solver.validate(puzzle)) {
        case 'invalid length':
          return res.json({ error: 'Expected puzzle to be 81 characters long' });
        case 'invalid character':
          return res.json({ error: 'Invalid characters in puzzle' });
      };

      if (!/^[A-I][1-9]$/i.test(coordinate)) return res.json({ error: 'Invalid coordinate' });

      if (!/^[1-9]$/.test(value)) return res.json({ error: 'Invalid value' });

      const position = coorConverter(coordinate.toUpperCase());
      const puzzleMap = solver.createMap(puzzle);
      if (puzzleMap[position.y][position.x] === value) return res.json({ valid: true });
      if (puzzleMap[position.y][position.x] !== '.' && puzzleMap[position.y][position.x] !== value) return res.json({ valid: false })
      const checkRow = solver.checkRowPlacement(puzzleMap, position.y, position.x, value);
      const checkCol = solver.checkColPlacement(puzzleMap, position.y, position.x, value); 
      const checkRegion = solver.checkRegionPlacement(puzzleMap, position.y, position.x, value);
      
      let conflictArray = [];
      if (!checkRow) {conflictArray.push('row')};
      if (!checkCol) {conflictArray.push('column')};
      if (!checkRegion) {conflictArray.push('region')};

      if (conflictArray.length === 0) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict: conflictArray });
      }
      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      if (!puzzle) return res.json({ error: 'Required field missing' });

      switch(solver.validate(puzzle)) {
        case 'invalid length':
          return res.json({ error: 'Expected puzzle to be 81 characters long' });
        case 'invalid character':
          return res.json({ error: 'Invalid characters in puzzle' });
      }
      
      if (solver.print(puzzle) === 'Cannot solve') return res.json({ error: 'Puzzle cannot be solved' });

      return res.json({ solution: solver.print(puzzle) });
    });
};
