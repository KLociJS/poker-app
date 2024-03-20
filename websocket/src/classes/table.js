const Dealer = require("./dealer");
const GameRules = require("./gameRules");

class Table {
  constructor(id, gameRules, dealer) {
    this.dealer = dealer;
    this.id = id;
    this.gameRules = gameRules;
    this.players = [];
  }

  startHandCycle() {
    this._moveDealerButton();
    const activePlayers = this._getActivePlayers();
    this.dealer.executePreFlop(activePlayers);
  }

  isTableFull() {
    const { maxPlayers } = this.gameRules.getRules();
    return this.players.length >= maxPlayers;
  }

  addPlayer(player) {
    const { maxPlayers } = this.rules.getRules();

    if (this.players.length >= maxPlayers) throw new Error("Table is full.");

    if (this.players.length < maxPlayers) {
      const playerSeatNumber = this.players.length;
      player.setSeatNumber(playerSeatNumber);
      this.players.push(player);
    }
  }

  removePlayer(playerId) {
    const player = this.players.find((p) => p.id === parseInt(playerId));
    if (!player) throw new Error("Player not found, cannot be removed");

    this.players = this.players.filter((p) => p.id !== parseInt(playerId));
  }

  _moveDealerButton() {
    //find current dealer
    const dealerButtonIndex = this.players.findIndex((p) => p.hasDealerButton);

    if (dealerButtonIndex === -1) {
      throw new Error("Dealer position not set. Cannot move dealer button.");
    }

    // re-arrange players array so that the first element is the player next to the current dealer
    const reArrangedPlayers = [
      ...this.players.slice(dealerButtonIndex + 1),
      ...this.players.slice(0, dealerButtonIndex + 1),
    ];
    const nextDealerIndex = reArrangedPlayers.findIndex(
      (p) => p.hasSitOut === false
    );

    this.players[dealerButtonIndex].hasDealerButton = false;
    reArrangedPlayers[nextDealerIndex].hasDealerButton = true;
  }

  _getActivePlayers() {
    return this.players.filter((p) => p.hasSitOut === false);
  }
}

const createEmptyTable = (id, maxPlayers, limit, stakes) => {
  const rules = new GameRules(limit, stakes, maxPlayers);
  const dealer = new Dealer(rules);
  return new Table(id, rules, dealer);
};

module.exports = {
  createEmptyTable,
  Table,
};
