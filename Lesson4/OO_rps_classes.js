const readline = require("readline-sync");
const OPTIONS = ["rock", "paper","scissors", "lizard", "spock"];
const WINNING_MOVES = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["paper", "spock"],
  spock: ["scissors", "rock"]
};

class Player {
  constructor() {
    this.move = null;
    this.score = 0;
    this.history = [];
  }
}

class Computer extends Player {
  constructor() {
    const STARTING_PERCENTAGE = 100 / OPTIONS.length;
    super();
    this.weightedChoices = {
      rock: STARTING_PERCENTAGE,
      paper: STARTING_PERCENTAGE,
      scissors: STARTING_PERCENTAGE,
      lizard: STARTING_PERCENTAGE,
      spock: STARTING_PERCENTAGE
    };
  }

  updateStrategy() {
    const PER_CHANGE = 0.1;
    const strategicResponse = {
      rock: "lizard",
      lizard: "spock",
      spock: "scissors",
      scissors: "paper",
      paper: "rock"
    };
    let humanMove = RPSGame.human.move;
    let computerMove = RPSGame.computer.move;
    let preferences = RPSGame.computer.weightedChoices;

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      let weightChange = Math.floor(preferences[computerMove] * PER_CHANGE);
      preferences[computerMove] -= weightChange;
      preferences[strategicResponse[computerMove]] += weightChange;
    }
  }

  choose() {
    let choices = [];
    Object.entries(this.weightedChoices).forEach(weightedChoice => {
      for (let count = 0; count < weightedChoice[1]; count++) {
        choices.push(weightedChoice[0]);
      }
    });
    let randomIndex = Math.floor(Math.random() * choices.length);
    this.move = choices[randomIndex];
  }
}


class Human extends Player {
  constructor() {
    super();
  }

  choose() {
    let choice;

    while (true) {
      console.log("Please choose rock, paper, scissors, lizard or spock:");
      choice = readline.question();
      if (OPTIONS.includes(choice)) break;
      console.log("Sorry, invalid choice.");
    }
    this.move = choice;
  }
}

const RPSGame = {
  human: new Human(),
  computer: new Computer(),

  displayWelcomeMessage() {
    console.log("Welcome to Rock, Paper, Scissors!");
  },

  displayGoodByeMessage() {
    console.log("Thanks for playing Rock, Paper, Scissors. Goodbye!");
  },

  displayWinner() {
    let humanMove = RPSGame.human.move;
    let computerMove = RPSGame.computer.move;

    console.log(`You chose: ${RPSGame.human.move}`);
    console.log(`The computer chose: ${RPSGame.computer.move}`);

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      console.log("You win!");
    } else if (humanMove === computerMove) {
      console.log("It's a tie");
    } else {
      console.log("Computer wins!");
    }
  },

  updateScores() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      this.human.score += 1;
    } else if (WINNING_MOVES[computerMove].includes(humanMove)) {
      this.computer.score += 1;
    }
  },

  updateHistory() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      this.human.history.push([humanMove, "win"]);
      this.computer.history.push([computerMove, "loss"]);
    } else if (humanMove === computerMove) {
      this.human.history.push([humanMove, "tie"]);
      this.computer.history.push([computerMove, "tie"]);
    } else {
      this.computer.history.push([computerMove, "win"]);
      this.human.history.push([humanMove, "loss"]);
    }
  },

  playAgain() {
    console.log("Would you like to play again? (y/n)");
    let answer = readline.question();
    return answer.toLowerCase()[0] === "y";
  },

  displayGrandWinner() {
    const WINS_FOR_MATCH = 5;
    if (this.human.score >= WINS_FOR_MATCH) {
      console.log("You are the grand winner!");
    } else if (this.computer.score >= WINS_FOR_MATCH) {
      console.log("The computer is the grand winner!");
    }
    if ((this.human.score >= WINS_FOR_MATCH)
      || this.computer.score >= WINS_FOR_MATCH) {
      this.human.score = 0;
      this.computer.score = 0;
    }
  },

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      this.updateScores();
      this.updateHistory();
      this.computer.updateStrategy();
      this.displayGrandWinner();
      if (this.playAgain()) {
        console.clear();
      } else {
        break;
      }
    }

    this.displayGoodByeMessage();
  },
};

RPSGame.play();