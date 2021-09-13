const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

const puzzleString = {
  valid: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
  invalidCharacter: '?.5..2.84..63.12.7.2..5?.,.?9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
  invalidLength: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.',
  cannotSolved: '..9..5.1.85.4....2432......1...69.83.5.....6.62.71...9......1945....4.37.4.3..6..',
  invalidFullString: '135762984946381257728459613694517832812936745357824196473288561581673429269145378'
};

const puzzleMap = {
  valid: solver.createMap(puzzleString.valid),
  invalidCharacter: solver.createMap(puzzleString.invalidCharacter),
  invalidLength: solver.createMap(puzzleString.invalidLength)
}

suite('UnitTests', () => {

  suite('validate function', function() {
    // #1
    test('valid 81 character string', function() {
      assert.equal(solver.validate(puzzleString.valid), 'valid', 'should return valid');
    });
    // #2
    test('invalid character', function() {
      assert.equal(solver.validate(puzzleString.invalidCharacter), 'invalid character', 'should return invalid character');
    });
    // #3
    test('invalid length', function() {
      assert.equal(solver.validate(puzzleString.invalidLength), 'invalid length', 'should return invalid length');
    });
  });

  suite('check row placement', function() {
    // #4
    test('valid row placement', function() {
      assert.isBoolean(solver.checkRowPlacement(puzzleMap.valid, 1, 0, '4'), 'should return boolean');
      assert.equal(solver.checkRowPlacement(puzzleMap.valid, 1, 0, '4'), true, 'should return true');
    });
    // #5
    test('invalid row placement', function() {
      assert.isBoolean(solver.checkRowPlacement(puzzleMap.valid, 1, 0, '7'), 'should return boolean');
      assert.equal(solver.checkRowPlacement(puzzleMap.valid, 1, 0, '7'), false, 'should return false');
    });
  });

  suite('check col placement', function() {
    // #6
    test('valid col placement', function() {
      assert.isBoolean(solver.checkColPlacement(puzzleMap.valid, 1, 0, '5'), 'should return boolean');
      assert.equal(solver.checkColPlacement(puzzleMap.valid, 1, 0, '5'), true, 'should return true');
    });
    // #7
    test('invalid col placement', function() {
      assert.isBoolean(solver.checkColPlacement(puzzleMap.valid, 1, 0, '4'), 'should return boolean');
      assert.equal(solver.checkColPlacement(puzzleMap.valid, 1, 0, '4'), false, 'should return false');
    });
  });

  suite('check region placement', function() {
    // #8
    test('valid region placement', function() {
      assert.isBoolean(solver.checkRegionPlacement(puzzleMap.valid, 1, 0, '8'), 'should return boolean');
      assert.equal(solver.checkRegionPlacement(puzzleMap.valid, 1, 0, '8'), true, 'should return true');
    });
    // #9
    test('invalid region placement', function() {
      assert.isBoolean(solver.checkRegionPlacement(puzzleMap.valid, 1, 0, '2'), 'should return boolean');
      assert.equal(solver.checkRegionPlacement(puzzleMap.valid, 1, 0, '2'), false, 'should return true');
    })
  });

  suite('solver function', function() {
    // #10
    test('incomplete string', function() {
      assert.equal(solver.print(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1], 'should return the result in puzzle 1');
      assert.equal(solver.print(puzzlesAndSolutions[1][0]), puzzlesAndSolutions[1][1], 'should return the result in puzzle 1');
      assert.equal(solver.print(puzzlesAndSolutions[2][0]), puzzlesAndSolutions[2][1], 'should return the result in puzzle 1');
      assert.equal(solver.print(puzzlesAndSolutions[3][0]), puzzlesAndSolutions[3][1], 'should return the result in puzzle 1');
      assert.equal(solver.print(puzzlesAndSolutions[4][0]), puzzlesAndSolutions[4][1], 'should return the result in puzzle 1');
    });
    // #11
    test('invalid string', function() {
      assert.equal(solver.print(puzzleString.invalidCharacter), 'invalid character', 'should return error invalid character');
      assert.equal(solver.print(puzzleString.invalidLength), 'invalid length', 'should return error invalid length');
      assert.equal(solver.print(puzzleString.cannotSolved), 'Cannot solve', 'should return error cannot solve');
      assert.equal(solver.print(puzzleString.invalidFullString), 'Cannot solve', 'should return error cannot solve');
    });
    // #12
    test('valid string', function() {
      assert.equal(solver.print(puzzlesAndSolutions[0][1]), puzzlesAndSolutions[0][1], 'should return the result in puzzle 1');
      assert.equal(solver.print(puzzlesAndSolutions[1][1]), puzzlesAndSolutions[1][1], 'should return the result in puzzle 1');
      assert.equal(solver.print(puzzlesAndSolutions[2][1]), puzzlesAndSolutions[2][1], 'should return the result in puzzle 1');
      assert.equal(solver.print(puzzlesAndSolutions[3][1]), puzzlesAndSolutions[3][1], 'should return the result in puzzle 1');
      assert.equal(solver.print(puzzlesAndSolutions[4][1]), puzzlesAndSolutions[4][1], 'should return the result in puzzle 1');
    })
  })
});


module.exports = { puzzleString };