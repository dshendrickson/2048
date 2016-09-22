var assert = require ("chai").assert;
var Board = require ("../lib/board.js")[0];
var Cell = require ("../lib/board.js")[1];




describe("board", function() {
  it('should construct a board with tiles based on the arguments', function() {
    var board = new Board(
      0, 0, 0, 2,
      2, 4, 4, 0,
      2, 4, 4, 0,
      2, 4, 4, 0
    );
    assert.equal(board.cells[15].value, 0);
    assert.equal(board.cells[3].value, 2);
  });

  it("should have a column", function() {
    var board = new Board();
    assert.equal(board.column, 4);
  });

  it("should have rows", function() {
    var board = new Board();
    assert.equal(board.row, 4);
  });


  it("should have a buildGrid function", function() {
    var board = new Board();
    assert.isFunction(board.buildGrid);
  });

  it("should make a grid with an array of 16 cells", function() {
    var board = new Board();
    assert.isArray(board.buildGrid());
    var array = board.buildGrid(4,4);
    assert.equal(array.length, 16);
  });

  it("should make a grid with appropriate corresponding rows and columns and null value", function() {
    var board = new Board(
      2, 0, 2, 4,
      2, 0, 0, 0,
      8, 8, 0, 0,
      2, 0, 16, 16
    );
    assert.equal(board.cells[0].row, 0);
    assert.equal(board.cells[15].column, 3);
    assert.equal(board.cells[15].column, 3);
    assert.equal(board.cells[4].row, 1);
    assert.equal(board.cells[5].value, 0);
  });

  it("should calculate the number of available cells and change as cells are added", function(){
    var board = new Board();
    board.buildGrid(4,4);
    var result = board.checkAvailalbeCells();
    assert.equal(result.length, 16);
    board.addValueToAvailableCell();
    var resultTwo = board.checkAvailalbeCells();
    assert.deepEqual(resultTwo.length, 15);
    board.addValueToAvailableCell();
    var resultThree = board.checkAvailalbeCells();
    assert.deepEqual(resultThree.length, 14);


  });

  it("should have a function for checking available cells", function() {
    var board = new Board();
    assert.isFunction(board.checkAvailalbeCells);
  });

  it("should generate a random number based on the availableCells", function(){
    var board = new Board(
      4, 4, 4, 4,
      8, 8, 8, 8,
      16, 16, 16, 16,
      0, 0, 0, 0
    );
    var randomNum = board.addValueToAvailableCell();
    assert(randomNum <= 4);
  });

  it("should give a value of 2 or 4 to a random available cell", function(){
    var board = new Board(
      4, 4, 4, 4,
      8, 8, 8, 8,
      16, 16, 16, 16,
      32, 32, 0, 32
    );
    board.addValueToAvailableCell();

    assert.oneOf(board.cells[14].value, [2, 4]);
  });
});



describe("testing ability to move in all directions", function() {

  it("should have a function for moving values", function() {
    var board = new Board();
    assert.isFunction(board.checkAndChangeValue);
  });


  it("should combine and move left", function(){

    var board = new Board(
    2, 0, 2, 2,
    2, 4, 0, 2,
    0, 4, 4, 2,
    2, 0, 4, 2
  );
    board.checkAndChangeValue(1);
    assert.equal(board.cells[0].value, 4);
    assert.equal(board.cells[1].value, 2);
    assert.equal(board.cells[2].value, 0);
  });

  it("should combine and move up", function(){

    var board = new Board(
    2, 0, 2, 2,
    2, 4, 0, 2,
    0, 4, 4, 2,
    2, 0, 4, 2
  );
    board.checkAndChangeValue(2);
    assert.equal(board.cells[0].value, 4);
    assert.equal(board.cells[4].value, 2);
    assert.equal(board.cells[2].value, 2);
    assert.equal(board.cells[3].value, 4);
    assert.equal(board.cells[7].value, 4);
    assert.equal(board.cells[6].value, 8);

  });

  it("should combine and move down", function() {
    var board = new Board(
      2, 0, 16, 2,
      2, 4, 0, 2,
      0, 4, 16, 2,
      2, 0, 8, 2
    );
    board.checkAndChangeValue(4);
    assert.equal(board.cells[12].value, 4);
    assert.equal(board.cells[8].value, 2);
    assert.equal(board.cells[13].value, 8);
    assert.equal(board.cells[14].value, 8);
    assert.equal(board.cells[10].value, 32);
    assert.equal(board.cells[15].value, 4);
    assert.equal(board.cells[11].value, 4);
  });

  it("should combine and move right", function() {
    var board = new Board(
      2, 2, 2, 2,
      2, 4, 4, 2,
      16, 0, 16, 2,
      2, 0, 0, 2
    );

    board.checkAndChangeValue(3);
    assert.equal(board.cells[0].value, 0);
    assert.equal(board.cells[2].value, 4);
    assert.equal(board.cells[3].value, 4);
    assert.equal(board.cells[4].value, 0);
    assert.equal(board.cells[5].value, 2);
    assert.equal(board.cells[6].value, 8);
    assert.equal(board.cells[10].value, 32);
    assert.equal(board.cells[15].value, 4);
  });

  it("should have a function for processing each move", function() {
    var board = new Board();
    assert.isFunction(board.processMove);
});

  it("processMove returns a boolean for moved by comparing previous state to current state", function() {
    var board = new Board();
    assert.isBoolean(board.processMove());
});

  it("should have a function for stringifying values", function() {
    var board = new Board();
    assert.isFunction(board.toString);
});

  it("toString function should return strings", function() {
    var board = new Board();
    assert.isString(board.toString(board.cells));
  });
});


  describe("testing move edge cases", function() {

  it("should combine when moving left and there are zero values in between", function() {
    var board = new Board(
      2, 0, 0, 2,
      0, 4, 0, 4,
      2, 0, 2, 0,
      2, 2, 0, 0
    );

    board.checkAndChangeValue(1);
    assert.equal(board.cells[0].value, 4);
    assert.equal(board.cells[3].value, 0);
    assert.equal(board.cells[4].value, 8);
    assert.equal(board.cells[8].value, 4);
    assert.equal(board.cells[12].value, 4);
  });

  it("should combine when moving up and there are zero values in between", function() {
    var board = new Board(
      2, 0, 2, 0,
      0, 2, 0, 0,
      0, 0, 2, 4,
      2, 2, 0, 4
    );

    board.checkAndChangeValue(2);
    assert.equal(board.cells[0].value, 4);
    assert.equal(board.cells[1].value, 4);
    assert.equal(board.cells[2].value, 4);
    assert.equal(board.cells[3].value, 8);
    assert.equal(board.cells[15].value, 0);
  });

  it("should combine when moving right and there are zero values in between", function() {
    var board = new Board(
      2, 0, 0, 2,
      0, 4, 0, 4,
      2, 0, 2, 0,
      2, 2, 0, 0
    );

    board.checkAndChangeValue(3);
    assert.equal(board.cells[0].value, 0);
    assert.equal(board.cells[3].value, 4);
    assert.equal(board.cells[7].value, 8);
    assert.equal(board.cells[11].value, 4);
    assert.equal(board.cells[15].value, 4);
  });

  it("should combine when moving down and there are zero values in between", function() {
    var board = new Board(
      2, 0, 2, 4,
      0, 2, 0, 4,
      0, 0, 2, 0,
      2, 2, 0, 0
    );

    board.checkAndChangeValue(4);
    assert.equal(board.cells[0].value, 0);
    assert.equal(board.cells[12].value, 4);
    assert.equal(board.cells[13].value, 4);
    assert.equal(board.cells[14].value, 4);
    assert.equal(board.cells[15].value, 8);
  });
});

describe("testing score functionality", function() {
  var cell = new Cell();
  it("should be able to calculate the score", function() {
    assert.isFunction(cell.calculateScore);
  });

  it("should be able to set the high score", function() {
    assert.isFunction(cell.setHighScore);
  });

  it("should update values of each cell with each move", function() {
    assert.isFunction(cell.update);
  });
});
