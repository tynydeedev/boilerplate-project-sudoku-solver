const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzleString } = require('./1_unit-tests.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();
const { valueFinder } = require('./test-utils.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Solve Request', function() {
    test('POST valid string', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          'puzzle': puzzlesAndSolutions[0][1]
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(solver.print(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1], 'should return right answer for puzzle 1');
          done();
        })
    });

    test('POST without string', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing', 'should return an error of missing field');
          done();
        })
    });

    test('POST with invalid character', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          'puzzle': puzzleString.invalidCharacter
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle', 'should return an error of invalid character');
          done();
        })
    });

    test('POST with invalid length', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          'puzzle': puzzleString.invalidLength
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'should return an error or invalid length');
          done();
        })
    });

    test('POST with cannot solved string', function(done) {
      chai
        .request(server)
        .post('/api/solve')
        .type('form')
        .send({
          'puzzle': puzzleString.cannotSolved
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved', 'should return an error of cannot solved');
          done();
        })
    })
  });
  
  suite('Check request', function() {
    test('check full all field with valid puzzle', function(done) {
      const puzzleInput = puzzlesAndSolutions[1][0];
      const data = valueFinder(puzzleInput, 0);
      // make request
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzleInput,
          'coordinate': data.coordinate,
          'value': data.value
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid, 'should return true');
          done();
        })
    });

    test('single conflict', function(done) {
      const puzzleInput = puzzlesAndSolutions[1][0];
      const data = valueFinder(puzzleInput, 1);
      // make request
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzleInput,
          'coordinate': data.coordinate,
          'value': data.value
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid, 'should be false');
          assert.isArray(res.body.conflict, 'should be array');
          assert.include(res.body.conflict, 'row', 'should return row conflict');
          assert.equal(res.body.conflict.length, 1, 'should return only 1 conflict');
          done();
        })
    });

    test('multiple conflict', function(done) {
      const puzzleInput = puzzlesAndSolutions[2][0];
      const data = valueFinder(puzzleInput, 2);
      // make request
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzleInput,
          'coordinate': data.coordinate,
          'value': data.value
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid, 'should be false');
          assert.equal(res.body.conflict.length, 2, 'should return 2 conflicts');
          assert.include(res.body.conflict, 'row', 'should include row');
          assert.include(res.body.conflict, 'column', 'should include column');
          done();
        })
    });

    test('conflicts everywhere', function(done) {
      const puzzleInput = puzzlesAndSolutions[3][0];
      const data = valueFinder(puzzleInput, 3);
      // make request
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzleInput,
          'coordinate': data.coordinate,
          'value': data.value
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid, 'should be false');
          assert.equal(res.body.conflict.length, 3, 'should return 3 conflicts');
          assert.include(res.body.conflict, 'row', 'should include row');
          assert.include(res.body.conflict, 'column', 'should include column');
          assert.include(res.body.conflict, 'region', 'should include region');
          done();
        })
    });

    test('missing fields', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzlesAndSolutions[0][0],
          'coordinate': 'D5'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing', 'should return an error of missing field');
          done();
        })
    });

    test('invalid character puzzle string', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzleString.invalidCharacter,
          'coordinate': 'A4',
          'value': '9'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle', 'should return an error of invalid character');
          done();
        })
    });

    test('invalid length puzzle string', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzleString.invalidLength,
          'coordinate': 'C8',
          'value': '8'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'should return an error of invalid length');
          done();
        })
    });

    test('invalid coordinate', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzleString.valid,
          'coordinate': 'Z10',
          'value': '9'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate', 'should return an error of invalid coordinate');
          done();
        })
    })

    test('invalid value', function(done) {
      chai
        .request(server)
        .post('/api/check')
        .type('form')
        .send({
          'puzzle': puzzleString.valid,
          'coordinate': 'B3',
          'value': '11'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value', 'should return an error of invalid value');
          done();
        })
    })
  })
});

