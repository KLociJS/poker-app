class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.seatNumber = null;
    this.totalHandCycleBet = 0;
    this.chips = null;
    this.cards = [];
    this.allIn = false;
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
