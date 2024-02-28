class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.seatNumber = null;
    this.chips = null;
    // this.cards = [];
    // this.bet = 0;
    // this.allIn = false;
    // this.hasFold = false;
    // this.hasSitOut = false;
  }

  setSeatNumber(seatNumber) {
    this.seatNumber = seatNumber;
  }

  setChips(chips) {
    this.chips = parseInt(chips);
  }
}

const createPlayer = (id, userName) => new Player(id, userName);

module.exports = {
  createPlayer,
};
