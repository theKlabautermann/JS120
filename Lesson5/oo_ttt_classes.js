const readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";
  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  getMarker() {
    return this.marker;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter++) {
      this.squares[String(counter)] = new Square();
    }
  }

  display() {
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
  }

  displayWithClear() {
    console.clear();
    console.log("");
    console.log("");
    this.display();
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }

  reset() {
    for (let counter = 1; counter <= 9; counter++) {
      this.squares[String(counter)] = new Square();
    }
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }

  increaseScore() {
    this.score += 1;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.first = this.human;
    this.second = this.computer;
  }

  static pointsForMatch = 3

  play() {
    this.displayWelcomeMessage();
    this.board.display();
    do {
      while (true) {
        if (this.first === this.human) {
          this.humanMoves();
        } else {
          this.computerMoves();
        }
        if (this.gameOver()) break;

        this.board.displayWithClear();
        if (this.second === this.computer) {
          this.computerMoves();
        } else {
          this.humanMoves();
        }
        if (this.gameOver()) break;

        this.board.displayWithClear();
      }
      this.board.displayWithClear();
      this.updateScores();
      this.displayResults();
      this.switchOrder();
    } while (this.human.score < TTTGame.pointsForMatch &&
             this.computer.score < TTTGame.pointsForMatch &&
             this.playAgain());
    this.displayGoodByeMessage();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  joinOr(arr, separator1 = ', ', separator2 = 'or') {
    if (arr.length === 0) {
      return "";
    } else if (arr.length === 1) {
      return String(arr[0]);
    } else if (arr.length === 2) {
      return `${arr[0]} ${separator2} ${arr[1]}`;
    } else {
      let result = arr.slice();
      let lastElement = result.pop();
      return `${result.join(separator1)}${separator1}${separator2} ${lastElement}`;
    }
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      choice = readline.question(`Choose a square (${this.joinOr(validChoices)}): `);
      if (validChoices.includes(choice)) {
        break;
      }
      console.log("Sorry, that's not a valid choice.");
      console.log(" ");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;
    if (this.ifAvailableReturnWinningMoveFor(this.computer)) {
      choice = this.ifAvailableReturnWinningMoveFor(this.computer);
    } else if (this.ifAvailableReturnWinningMoveFor(this.human)) {
      choice = this.ifAvailableReturnWinningMoveFor(this.human);
    } else if (this.board.squares["5"].getMarker() === Square.UNUSED_SQUARE) {
      choice = "5";
    } else {
      do {
        choice = Math.floor((9 * Math.random()) + 1).toString();
      } while (!validChoices.includes(choice));
    }
    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  ifAvailableReturnWinningMoveFor(player) {
    for (let row = 0; row < TTTGame.POSSIBLE_WINNING_ROWS.length; row++) {
      let playerCount = 0;
      let freeCount = 0;
      let winningField = null;
      for (let position = 0; position <= 2; position++) {
        let currentField = this.board.squares[TTTGame.POSSIBLE_WINNING_ROWS[row][position]];
        if (currentField.getMarker() === player.getMarker()) playerCount += 1;
        if (currentField.getMarker() === Square.UNUSED_SQUARE) {
          freeCount += 1;
          winningField = TTTGame.POSSIBLE_WINNING_ROWS[row][position];
        }
        if (playerCount === 2 && freeCount === 1) {
          return winningField;
        }
      }
    }
    return undefined;
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  static POSSIBLE_WINNING_ROWS = [
    ["1", "2", "3"], // top row of board
    ["4", "5", "6"], // center row of board
    ["7", "8", "9"], // bottom row of board
    ["1", "4", "7"], // left column of board
    ["2", "5", "8"], // middle column of board
    ["3", "6", "9"], // right column of board
    ["1", "5", "9"], // diagonal: top-left to bottom-right
    ["3", "5", "7"], // diagonal: top-right to bottom-left
  ];

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  updateScores() {
    if (this.isWinner(this.human)) {
      this.human.increaseScore();
    } else if (this.isWinner(this.computer)) {
      this.computer.increaseScore();
    }
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
    console.log(`Score: You: ${this.human.score}, computer: ${this.computer.score}.
                ${(this.human.score === TTTGame.pointsForMatch
                || this.computer.score === TTTGame.pointsForMatch) ? "" : " 3 wins to win the match!"}`);
    if (this.human.score === 3) {
      console.log("You are the match winner!");
    }
    if (this.computer.score === 3) {
      console.log("I am the match winner!");
    }
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  playAgain() {
    let ACCEPTABLE_RESPONSES = ["y", "n", "Y", "N"];
    let response;
    do {
      response = readline.question("Do you want to play again? (y/n): ");
    } while (!ACCEPTABLE_RESPONSES.includes(response));

    if (response.toLowerCase() === "y") {
      this.board.reset();
      this.board.displayWithClear();
      return true;
    } else {
      return false;
    }
  }

  displayGoodByeMessage() {
    console.log("Thanks for playing Tic Tac Toe!");
  }

  switchOrder() {
    [this.first, this.second] = [this.second, this.first];
  }
}

let ticTacToe = new TTTGame();
ticTacToe.play();