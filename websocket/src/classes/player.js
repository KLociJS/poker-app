class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.hasDealerButton = false;
    this.totalHandCycleBet = 0;
    this.currentRoundBet = 0;
    this.chips = null;
    this.cards = [];
    this.hasSitOut = false;
  }

  addCard(card) {
    this.cards.push(card);
  }

  cleanCards() {
    this.cards = [];
  }

  setChips(chips) {
    this.chips = parseInt(chips);
  }

  betChips(amount) {
    this.chips -= amount - this.currentRoundBet;
    this.totalHandCycleBet += amount - this.currentRoundBet;
    this.currentRoundBet = amount;
  }

  resetCurrentRoundBet() {
    this.currentRoundBet = 0;
  }

  hasSitOut() {
    return this.hasSitOut;
  }
}

module.exports = Player;
