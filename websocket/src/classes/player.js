class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.seatNumber = null;
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

  setSeatNumber(seatNumber) {
    this.seatNumber = seatNumber;
  }

  setChips(chips) {
    this.chips = parseInt(chips);
  }

  betChips(amount) {
    this.chips -= amount;
    this.totalHandCycleBet += amount;
    this.currentRoundBet += amount;
  }

  resetCurrentRoundBet() {
    this.currentRoundBet = 0;
  }

  hasSitOut() {
    return this.hasSitOut;
  }
}

const createPlayer = (id, userName) => new Player(id, userName);

module.exports = {
  createPlayer,
  Player,
};
