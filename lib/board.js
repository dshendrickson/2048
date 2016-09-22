var $ = require("jquery");
var rowFor = require("./row-for");
var columnFor = require("./column-for");

var score = 0;
var highScore = 0;
var checkMovePossibleArray = [];


function setUpGame() {
  var board = new Board();
  var game = new Game();
  board.addValueToAvailableCell.bind(board)();
  board.addValueToAvailableCell.bind(board)();
  board.render.bind(board)();
  document.addEventListener('keydown', board.handleKey.bind(board, game));
  renderHighScore();
  resetScore();
}

$(document).ready(function(){
  setUpGame();
});


//TODO:delete unnecessary functions
//work on lost game function

$(".new-game-button").on("click", function(){
  location.reload ();
});

function Board() {
  this.row = 4;
  this.column = 4;
  this.cells = [];
  this.buildGrid(arguments);
}

function Cell(row, column, value) {
  this.row = row;
  this.column = column;
  this.value = value;
}

function Game () {
  this.cells =[];
  this.score = score;
  this.highScore = highScore;
}

Board.prototype = {

  addValueToAvailableCell: function() {
    var available = this.checkAvailalbeCells();
    var index = Math.floor(Math.random() * (available.length));
    return available[index].value = (Math.random() < 0.9 ? 2 : 4);
  },

  buildGrid: function(cells) {
    if (this.cells.length) {
      return this.cells;
    }
    for (var i = 0; i < 16; i++) {
      var value = cells[i] ? cells[i] : 0;
      this.cells.push(new Cell(rowFor(i), columnFor(i), value));
    }
  },

  checkAndChangeValue: function(direction) {
    var slice;
    var directionBoolean;

    if (direction === 1 || direction === 3) {
      slice = [
        [this.cells[0], this.cells[1], this.cells[2], this.cells[3]],
        [this.cells[4], this.cells[5], this.cells[6], this.cells[7]],
        [this.cells[8], this.cells[9], this.cells[10], this.cells[11]],
        [this.cells[12], this.cells[13], this.cells[14], this.cells[15]]
      ];
    } else {
      slice = [
        [this.cells[0], this.cells[4], this.cells[8], this.cells[12]],
        [this.cells[1], this.cells[5], this.cells[9], this.cells[13]],
        [this.cells[2], this.cells[6], this.cells[10], this.cells[14]],
        [this.cells[3], this.cells[7], this.cells[11], this.cells[15]]
      ];
    }

    if (direction === 1) {
      directionBoolean = true;
    } else if (direction === 2){
      directionBoolean = true;
    } else if (direction === 3) {
      directionBoolean = false;
    } else {
      directionBoolean = false;
    }

    for (var i = 0; i < 4; i++) {
      for (var j = directionBoolean ? 0 : 3; directionBoolean ? j < 4 : j >= 0; directionBoolean ? j++ : j-- ) {
        slice[i][j].update(directionBoolean, slice[i], j);
      }
    }
  },

  checkAvailalbeCells: function() {
    var available = this.cells.filter(function(item) {
      return item.value === 0;
    });
    return available;
  },

  checkForMerge: function() {
    var slice;
    checkMovePossibleArray = [];
    debugger;

    for (var x = 1; x < 3 ; x++) {
      var directionBoolean = true;

    if (x === 1) {
      slice = [
        [this.cells[0], this.cells[1], this.cells[2], this.cells[3]],
        [this.cells[4], this.cells[5], this.cells[6], this.cells[7]],
        [this.cells[8], this.cells[9], this.cells[10], this.cells[11]],
        [this.cells[12], this.cells[13], this.cells[14], this.cells[15]]
      ];
    }
    if (x === 2) {
      slice = [
        [this.cells[0], this.cells[4], this.cells[8], this.cells[12]],
        [this.cells[1], this.cells[5], this.cells[9], this.cells[13]],
        [this.cells[2], this.cells[6], this.cells[10], this.cells[14]],
        [this.cells[3], this.cells[7], this.cells[11], this.cells[15]]
      ];
    }

      for (var i = 0; i < 4; i++) {
        for (var j = directionBoolean ? 0 : 3; directionBoolean ? j < 4 : j >= 0; directionBoolean ? j++ : j-- ) {
          slice[i][j].cellMergeCheck(directionBoolean, slice[i], j);
        }
      }
    }
    return checkMovePossibleArray;
  },

  clearBoard: function() {
    this.cells = [];
  },

  fromStorage: function () { //Function not implemented yet
    return JSON.parse(localStorage.get(value));
  },

  handleKey: function(game, event) {
    var moved = false;

    switch (event.keyCode) {
      case 37: // Left
      case 38: // Up
      case 39: // Right
      case 40: // Down
       event.preventDefault();
       break;
    }

    switch (event.keyCode) {
      case 37: // Left
        moved = this.processMove(1);
        break;
      case 38: // Up
        moved = this.processMove(2);
        break;
      case 39: // Right
       moved = this.processMove(3);
        break;
      case 40: // Down
        moved = this.processMove(4);
        break;
      }
      if (moved) {
        this.addValueToAvailableCell();
        this.render();
      }

      if (this.checkAvailalbeCells().length === 0 && this.checkForMerge().length === 0) {
        lose();
      }
  },

  printBoard: function() {
    for (var i = 0; i < 16; i++) {
    }
  },

  processMove: function(direction) {
    var moved = true;
    var previousState = this.toString(this.cells);
    this.checkAndChangeValue(direction);
    var currentState = this.toString(this.cells);
    if (previousState === currentState) {
      moved = false;
    }
    localStorage.setItem('state', currentState);
    localStorage.setItem('score', score);
    return moved;
  },

  render: function() {
    for (var i = 0; i < this.cells.length; i++) {
      var tile = document.getElementById(i);
      tile.innerHTML = this.cells[i].value;
      tile.className = (`tile${this.cells[i].value}`);
    }
  },

  toString: function(value) {
    return JSON.stringify(value);
  },

  toStorage: function(tag, value) { //Function not implemented yet
      localStorage.setItem(tag, value);
  }
};

Cell.prototype = {

  update: function(direction, slice, positionInSlice) {
    for (var i = positionInSlice; direction ? ++i < 4 : --i >= 0;) {
      if (this.value === slice[i].value && this.value !== 0) {
        this.value = this.value * 2;
        slice[i].value = 0;
        this.calculateScore(this.value);
        this.setHighScore();
        return;
      } else if (this.value === 0 && slice[i].value > 0){
        this.value = slice[i].value;
        slice[i].value = 0;
      } else if (slice[i].value > 0) {
        return;
      } else {
        continue;
      }
    }
  },

  cellMergeCheck: function(direction, slice, positionInSlice) {
    for (var i = positionInSlice; direction ? ++i < 4 : --i >= 0;) {
      console.log(this);
      if (this.value === slice[i].value && this.value !== 0) {
        console.log(slice[i]);
        debugger;
        checkMovePossibleArray.push(true);
      }
      // } else {
      //   checkMovePossibleArray.push(false);

    }
  },

  calculateScore: function(value) {
    score += value;
    $('.current-score').text(score);
  },

  setHighScore: function() {
    var highScore = getHighScore();
    if (score >= highScore) {
      highScore = score;
    }
    localStorage.setItem('highScore', highScore);
    renderHighScore();
  }
};

function lose() {
 alert('you lose');
}


function getHighScore() {
  storedHighScore = JSON.parse(localStorage.getItem('highScore'));
  if (storedHighScore) {
    highScore = storedHighScore;
  }
  return highScore;
}

function renderHighScore() {
  var highScore = getHighScore();
  $('.high-score').text(highScore);
}

function resetScore() {
  score = 0;
  $('.current-score').text(score);
  localStorage.setItem('score', score);
}


module.exports = [Board, Cell];
