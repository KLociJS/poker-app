const { SUIT, RANK } = require("../constants/cards");

class Deck {
  constructor() {
    this._initDeck();
  }

  drawCard() {
    return this.cards.pop();
  }

  burnCard() {
    this.cards.pop();
  }

  shuffle() {
    this._initDeck();
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  _initDeck() {
    const deck = [];
    SUIT.forEach((suit) => {
      RANK.forEach((rank) => {
        deck.push({ rank, suit });
      });
    });
    this.cards = deck;
  }
}

module.exports = Deck;
