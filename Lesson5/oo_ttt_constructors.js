const readline = require("readline-sync");

function CreateSquare(marker = CreateSquare.UNUSED_SQUARE) {
  this.marker = marker;
}

CreateSquare.UNUSED_SQUARE = " ";
CreateSquare.HUMAN_MARKER = "X";
CreateSquare.COMPUTER_MARKER = "O";

CreateSquare.prototype.toString = function() {
  return this.marker;
};

CreateSquare.prototype.setMarker = function(marker) {
  this.marker = marker;
};

CreateSquare.prototype.isUnused = function() {
  return this.marker === CreateSquare.UNUSED_SQUARE;
};

CreateSquare.prototype.getMarker = function() {
  return this.marker;
};

function CreateBoard() {
  this.squares = {};
  for (let counter = 1; counter <= 9; counter++) {
    this.squares[String(counter)] = new CreateSquare();
  }
}

CreateBoard.prototype.display = function() {
  console.log("");
  console.log("     |     |");
  console.log(`  ${this.squares[1].toString()}  |  ${this.squares[2].toString()}  |  ${this.squares[3].toString()}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(`  ${this.squares[4].toString()}  |  ${this.squares[5].toString()}  |  ${this.squares[6].toString()}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(`  ${this.squares[7].toString()}  |  ${this.squares[8].toString()}  |  ${this.squares[9].toString()}`);
  console.log("     |     |");
  console.log("");
};

CreateBoard.prototype.displayWithClear = function() {
  console.clear();
  console.log("");
  console.log("");
  this.display();
};

CreateBoard.prototype.markSquareAt = function(key, marker) {
  this.squares[key].setMarker(marker);
};

CreateBoard.prototype.unusedSquares = function() {
  let keys = Object.keys(this.squares);
  return keys.filter(key => this.squares[key].isUnused());
};

CreateBoard.prototype.isFull = function() {
  return this.unusedSquares().length === 0;
};

CreateBoard.prototype.countMarkersFor = function(player, keys) {
  let markers = keys.filter(key => {
    return this.squares[key].getMarker() === player.getMarker();
  });

  return markers.length;
};

function CreatePlayer(marker) {
  this.marker = marker;
}

CreatePlayer.prototype.getMarker = function() {
  return this.marker;
};

function CreateHuman() {
  CreatePlayer.call(this, CreateSquare.HUMAN_MARKER);
}

CreateHuman.prototype = Object.create(CreatePlayer.prototype);
CreateHuman.prototype.constructor = CreateHuman;

// Which Object should I reference?
  // A: Assigning Object.create(CreatePlayer.prototype)
    // Would assign an empty object that can delegate to CreatePlayer.prototype
  // B: Assigning new CreatePlayer()
    // Would assign the static properties & delegate to CreatePlayer.prototype
  // C: Assigning CreatePlayer.prototype
    // Probably not it. Player and Human would have the same prototype.

// How should I reference it?
  // A: Using CreateHuman.prototype
  // B: Using Object.setPrototypeOf(CreateHuman, CreatePlayer.prototype)
  // C: Using CreateHuman.__proto__

function CreateComputer() {
  CreatePlayer.call(this, CreateSquare.COMPUTER_MARKER);
}

CreateComputer.prototype = Object.create(CreatePlayer.prototype);
CreateComputer.prototype.constructor = CreateComputer;

function CreateTTTGame() {
  this.board = new CreateBoard();
  this.human = new CreateHuman();
  this.computer = new CreateComputer();
}

CreateTTTGame.prototype.play = function() {
  this.displayWelcomeMessage();
  this.board.display();
  while (true) {
    this.humanMoves();
    if (this.gameOver()) break;

    this.computerMoves();
    if (this.gameOver()) break;

    this.board.displayWithClear();
  }
  this.board.displayWithClear();
  this.displayResults();
  this.displayGoodByeMessage();
};

CreateTTTGame.prototype.displayWelcomeMessage = function() {
  console.clear();
  console.log("Welcome to Tic Tac Toe!");
  console.log("");
};

CreateTTTGame.prototype.humanMoves = function() {
  let choice;

  while (true) {
    let validChoices = this.board.unusedSquares();
    choice = readline.question(`Choose a square (${validChoices.join(", ")}): `);
    if (validChoices.includes(choice)) {
      break;
    }
    console.log("Sorry, that's not a valid choice.");
    console.log("");
  }

  this.board.markSquareAt(choice, this.human.getMarker());
};

CreateTTTGame.prototype.computerMoves = function() {
  let validChoices = this.board.unusedSquares();
  let choice;

  do {
    choice = Math.floor((9 * Math.random()) + 1).toString();
  } while (!validChoices.includes(choice));

  this.board.markSquareAt(choice, this.computer.getMarker());
};

CreateTTTGame.prototype.gameOver = function() {
  return this.board.isFull() || this.someoneWon();
};

CreateTTTGame.POSSIBLE_WINNING_ROWS = [
  ["1", "2", "3"], // top row of board
  ["4", "5", "6"], // center row of board
  ["7", "8", "9"], // bottom row of board
  ["1", "4", "7"], // left column of board
  ["2", "5", "8"], // middle column of board
  ["3", "6", "9"], // right column of board
  ["1", "5", "9"], // diagonal: top-left to bottom-right
  ["3", "5", "7"], // diagonal: top-right to bottom-left
];

CreateTTTGame.prototype.someoneWon = function() {
  return this.isWinner(this.human) || this.isWinner(this.computer);
};

CreateTTTGame.prototype.displayResults = function() {
  if (this.isWinner(this.human)) {
    console.log("You won! Congratulations!");
  } else if (this.isWinner(this.computer)) {
    console.log("I won! Take that, human!");
  } else {
    console.log("A tie game. How boring.");
  }
};

CreateTTTGame.prototype.isWinner = function(player) {
  return CreateTTTGame.POSSIBLE_WINNING_ROWS.some(row => {
    return this.board.countMarkersFor(player, row) === 3;
  });
};

CreateTTTGame.prototype.displayGoodByeMessage = function() {
  console.log("Thanks for playing Tic Tac Toe!");
};


let ticTacToe = new CreateTTTGame();
ticTacToe.play();