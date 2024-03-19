const { DECK } = require("../constants/cards");

class Deck {
  constructor() {
    this.cards = [];
  }

  drawCard() {
    return this.cards.pop();
  }

  burnCard() {
    this.cards.pop();
  }

  shuffle() {
    this.cards = [...DECK];
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}

module.exports = {
  Deck,
};
