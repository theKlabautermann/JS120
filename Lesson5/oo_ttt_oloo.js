const readline = require("readline-sync");

let Square = {
  UNUSED_SQUARE: " ",
  HUMAN_MARKER: "X",
  COMPUTER_MARKER: "O",

  toString: function() {
    return this.marker;
  },

  setMarker: function(marker) {
    this.marker = marker;
  },

  isUnused: function() {
    return this.marker === Square.UNUSED_SQUARE;
  },

  getMarker: function() {
    return this.marker;
  },

  init: function(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
    return this;
  }
};

let Board = {
  display: function() {
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
  },

  displayWithClear: function() {
    console.clear();
    console.log("");
    console.log("");
    this.display();
  },

  markSquareAt: function(key, marker) {
    this.squares[key].setMarker(marker);
  },

  unusedSquares: function() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  },

  isFull: function() {
    return this.unusedSquares().length === 0;
  },

  countMarkersFor: function(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  },

  init: function() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter++) {
      this.squares[String(counter)] = Object.create(Square).init();
    }
    return this;
  }
};

let Player = {
  getMarker: function() {
    return this.marker;
  },

  init: function(marker) {
    this.marker = marker;
    return this;
  }
};

let Human = {
  init: function() {
    Player.init.call(this, Square.HUMAN_MARKER);
    return this;
  }
};

Object.setPrototypeOf(Human, Player);

let Computer = {
  init: function() {
    Player.init.call(this, Square.COMPUTER_MARKER);
    return this;
  }
};

Object.setPrototypeOf(Computer, Player);

let TTTGame = {
  play: function() {
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
  },

  displayWelcomeMessage: function() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  },

  humanMoves: function() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      choice = readline.question(`Choose a square (${validChoices.join(", ")}): `);
      if (validChoices.includes(choice)) {
        break;
      }
      console.log("Sorry, that's not a valid choice.");
      console.log(" ");
    }
    this.board.markSquareAt(choice, this.human.getMarker());
  },

  computerMoves: function() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    this.board.markSquareAt(choice, this.computer.getMarker());
  },

  gameOver: function() {
    return this.board.isFull() || this.someoneWon();
  },

  POSSIBLE_WINNING_ROWS: [
    ["1", "2", "3"], // top row of board
    ["4", "5", "6"], // center row of board
    ["7", "8", "9"], // bottom row of board
    ["1", "4", "7"], // left column of board
    ["2", "5", "8"], // middle column of board
    ["3", "6", "9"], // right column of board
    ["1", "5", "9"], // diagonal: top-left to bottom-right
    ["3", "5", "7"], // diagonal: top-right to bottom-left
  ],

  someoneWon: function() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  },

  displayResults: function() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  },

  isWinner: function(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  },

  displayGoodByeMessage: function() {
    console.log("Thanks for playing Tic Tac Toe!");
  },

  init: function() {
    this.board = Object.create(Board).init();
    this.human = Object.create(Human).init();
    this.computer = Object.create(Computer).init();
    return this;
  }
};

let ticTacToe = Object.create(TTTGame).init();
ticTacToe.play();