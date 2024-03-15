const { Dealer } = require("./dealer");
const { GameRules } = require("./gameRules");

class Table {
  constructor(id, rules, dealer) {
    this.dealer = dealer;
    this.id = id;
    this.rules = rules;
    this.players = [];
  }

  startHandCycle() {
    const activePlayers = this._getActivePlayers();
    this.dealer.executePreFlop(activePlayers);
  }

  isTableFull() {
    const { maxPlayers } = this.rules.getRules();
    return this.players.length >= maxPlayers;
  }

  addPlayer(player) {
    const { maxPlayers } = this.rules.getRules();

    if (this.players.length >= maxPlayers) throw new Error("Table is full.");

    if (this.players.length < maxPlayers) {
      const playerSeatNumber = this.players.length;
      player.setSeatNumber(playerSeatNumber);
      this.players.push(player);
      // sort players by seat number ascending
      this.players.sort((a, b) => a.seatNumber - b.seatNumber);
    }
  }

  removePlayer(playerId) {
    const player = this.players.find((p) => p.id === parseInt(playerId));
    if (!player) throw new Error("Player not found, cannot be removed");

    this.players = this.players.filter((p) => p.id !== parseInt(playerId));
  }

  _getActivePlayers() {
    return this.players.filter((p) => p.hasSitOut === false);
  }
}

const createEmptyTable = (id, maxPlayers, limit, stakes) => {
  const dealer = new Dealer();
  const rules = new GameRules(limit, stakes, maxPlayers);
  return new Table(id, rules, dealer);
};

module.exports = {
  createEmptyTable,
};
