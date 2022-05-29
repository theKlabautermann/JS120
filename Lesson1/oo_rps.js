const readline = require("readline-sync");
const OPTIONS = ["rock", "paper","scissors", "lizard", "spock"];
const WINNING_MOVES = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["paper", "spock"],
  spock: ["scissors", "rock"]
};


const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log("Welcome to Rock, Paper, Scissors!");
  },

  displayGoodByeMessage() {
    console.log("Thanks for playing Rock, Paper, Scissors. Goodbye!");
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      console.log("You win!");
    } else if ((humanMove === computerMove)) {
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
    } else if ((humanMove === computerMove)) {
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
      this.computer.updateStrategy.call(this);
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

function createPlayer() {
  return {
    move: null,
    score: 0,
    history: []
  };
}

function createComputer() {
  const STARING_PERCENTAGE = 100 / OPTIONS.length;
  const PER_CHANGE = 0.1;
  let playerObject = createPlayer();

  let computerObject = {
    weightedChoices: {
      rock: STARING_PERCENTAGE,
      paper: STARING_PERCENTAGE,
      scissors: STARING_PERCENTAGE,
      lizard: STARING_PERCENTAGE,
      spock: STARING_PERCENTAGE
    },

    updateStrategy() {
      const strategicResponse = {
        rock: "lizard",
        lizard: "spock",
        spock: "scissors",
        scissors: "paper",
        paper: "rock"
      };
      let humanMove = this.human.move;
      let computerMove = this.computer.move;
      let preferences = this.computer.weightedChoices;

      if (WINNING_MOVES[humanMove].includes(computerMove)) {
        let weightChange = Math.floor(preferences[computerMove] * PER_CHANGE);
        preferences[computerMove] -= weightChange;
        preferences[strategicResponse[computerMove]] += weightChange;
      }
    },

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
  };

  return Object.assign(playerObject, computerObject);
}


function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
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
  };

  return Object.assign(playerObject, humanObject);
}

RPSGame.play();