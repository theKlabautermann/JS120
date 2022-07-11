/*

Deck:
Start with a standard 52-card deck consisting of:
the 4 suits (Hearts, Diamonds, Clubs, and Spades), and
13 values (2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace).

Goal: The goal of Twenty-One is to try to get as close to 21 as possible
without going over. If you go over 21, it's a bust, and you lose.

Setup:
The game consists of a dealer and a player.
Both participants are initially dealt a hand of two cards.
The player can see their 2 cards, but can only see one of the dealer's cards.

Card Values:
The cards with numbers 2 through 10 are worth their face value.
The Jack, Queen, and King are each worth 10.
The Ace can be worth 1 or 11 depending on circumstances.
  For example, if the hand contains a 2, an Ace, and a 5, then the total value of the hand is 18.
  In this case, the Ace is worth 11 because the sum of the hand (2 + 11 + 5) doesn't exceed 21.
  Now, say another card is drawn, and it happens to be an Ace.
  Your program must determine the value of both Aces.
  If the sum of the hand (2 + 11 + 5 + 11) exceeds 21, then one of the Aces must be worth 1,
  resulting in the hand's total value being 19

Player turn:
The player always goes first, and can decide to either hit or stay.
A hit means the player wants to be dealt another card.
Remember, if his total exceeds 21, he will bust and lose the game.

Dealer turn:
When the player stays, it's the dealer's turn.
The dealer must follow a strict rule for determining whether to hit or stay:
hit until the total is at least 17. If the dealer busts, then the player wins.

Comparing cards:
When both the player and the dealer stay, it's time to compare the total value of the cards
and see who has the highest value.

Nouns:
  - Deck
    - Card (suit, value, worth?)
    - deal()

  - Game
    - start
    - turn?
    - Compare (total value of the cards)

  - Participants (Hand?)
    - Player
      - Hit (dealt one card)
      - Stay
      - bust
      - Score?

    - Dealer
      - Hit (dealt one card)
      - Stay
      - bust
      - score?
    - Going over? (Bust)
*/

const readline = require("readline-sync");

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.worth = Card.VALUES_WORTH[value];
  }

  static VALUES_WORTH = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    Jack: 10,
    Queen: 10,
    King: 10,
    Ace: [1, 11]
  };
}

class Deck {
  constructor() {
    this.cards = [];
    let suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
    for (let suit = 0; suit < suits.length; suit++) {
      let currentSuit = suits[suit];
      for (let value = 0; value < values.length; value++) {
        let currentValue = values[value];
        this.cards.push(new Card(currentSuit, currentValue));
      }
    }
  }

  deal() {
    // STUB
    // Should assign 2 cards two both participants.
    // Currently implemented in the Game Class
  }

  shuffle() {
    for (let index = this.cards.length - 1; index > 0; index--) {
      let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
      [this.cards[index], this.cards[otherIndex]] = [this.cards[otherIndex], this.cards[index]]; // swap elements
    }
  }

  draw() {
    return this.cards.pop();
  }
}

class Participant {

  constructor() {
    this.hand = [];
  }

  hit(card) {
    this.hand.push(card);
  }

  stay() {
    // STUB
  }

  bust() { // Does this belong here or in the Game class?
    // STUB
  }

  display() {
    console.log(`The ${this.name} holds: ${this.hand.map(card => card.value).join(", ")}. That's worth ${this.computeHandTotal()}`);
  }

  computeHandTotal() {
    let total = 0;

    let cards = this.hand;
    for (let cardNum = 0; cardNum < cards.length; cardNum++) {
      if (cards[cardNum].value !== "Ace") {
        console.log(`Check: ${cards[cardNum].value}`);
        total += cards[cardNum].worth;
      } else {
        total += 1; // How do I decide the value of the Ace?
      }
    }
    return total;
  }
}

class Player extends Participant {
  constructor() {
    super();
    this.name = "Player";
    // STUB
  }

  getDecision() {
    let choice;
    do {
      choice = readline.question("Do you want to hit or stay?");
    } while (["hit, stay"].includes(choice));

    return choice;
  }
}

class Dealer extends Participant {
  constructor() {
    super();
    this.name = "Dealer";
    // STUB
  }

  static HIT_UNTIL = 17;

  displayOne() {
    console.log(`The dealer holds a ${this.hand[0].value} and one hidden card.`);
  }
}

class Game {
  static BUST_LIMIT = 21;
  static CARDS_AT_START = 2

  constructor() {
    this.player = new Player();
    this.dealer = new Dealer();
    this.deck = new Deck();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to 21!");
    console.log("");
  }

  displayGoodByeMessage() {
    console.log("Thanks for playing 21!");
  }

  deal() {
    for (let numOfCards = 0; numOfCards < Game.CARDS_AT_START; numOfCards++) {
      this.player.hit(this.deck.draw());
      this.dealer.hit(this.deck.draw());
    }
  }

  displayResults() { // Doesn't yet check if anyone is bust.
    let winner;

    if (this.player.computeHandTotal() > this.dealer.computeHandTotal()) {
      winner = this.player.name;
    } else {
      winner = this.dealer.name;
    }
    this.player.display();
    this.dealer.display();
    console.log(`The winner is ${winner}`);
  }

  play() {
    // STUB
    // Welcome Message --> Needs a method
    // PlayerTurn
      // Display Dealer Hand (One card hidden)
      // Display Player Hand (and a total)
      // Let the Player decide if they want to hit or stay
      // Repeat until they stay or bust
    // Dealer Turn
      // If player bust, break
      // Display the dealer hand, this time all cards with a total
      // If his total is over 17, stay. Otherwise hit, redisplay hand every time
    // Compare Hands and display Result
    // Goodbye Message --> Needs a method

    this.displayWelcomeMessage();
    this.deck.shuffle();
    this.deal();
    console.log(`Player has: ${this.player.hand}`);
    console.log(`Dealer has: ${this.dealer.hand}`);
    do {
      //console.clear();
      this.dealer.displayOne();
      this.player.display();
      if (this.player.getDecision() === "hit") {
        this.player.hit(this.deck.draw());
      } else {
        break;
      }
      console.log(`HandTotal: ${this.player.computeHandTotal()}`);
      console.log(`Bust limit: ${Game.BUST_LIMIT}, ${this.player.computeHandTotal() < Game.BUST_LIMIT}`);
    } while (this.player.computeHandTotal() < Game.BUST_LIMIT);

    while (this.dealer.computeHandTotal() <= Dealer.HIT_UNTIL &&
           this.player.computeHandTotal() < Game.BUST_LIMIT) {
      if (this.dealer.computeHandTotal() > Game.BUST_LIMIT) break;
      this.dealer.display();
      this.dealer.hit();
    }

    this.displayResults();
    this.displayGoodByeMessage();
  }
}

// Need to update computeHandTotal function so that it values aces correctly.
// Need to create the Hit and Stay Mechanic

let twentyone = new Game();
twentyone.play();