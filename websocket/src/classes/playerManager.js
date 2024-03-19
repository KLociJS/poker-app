class PlayerManager {
  constructor() {
    this.activePlayers = [];
    this.playersAllIn = [];
    this.playerToAct = null;
    this.lastPlayerToAct = null;
  }

  getActivePlayers() {
    return this.activePlayers;
  }

  setActivePlayers(players) {
    this.activePlayers = players;
  }

  addAllInPlayer(player) {
    this.playersAllIn.push(player);
  }

  removeActivePlayer(player) {
    this.activePlayers = this.activePlayers.filter((p) => p.id !== player.id);
  }

  setLastPlayerToActAfterBetOrRaise(bettingPlayer) {
    const bettingPlayerIndex = this.activePlayers.findIndex(
      (p) => p.id === bettingPlayer.id
    );

    this.lastPlayerToAct =
      bettingPlayerIndex === 0
        ? this.activePlayers[this.activePlayers.length - 1]
        : (this.lastPlayerToAct = this.activePlayers[bettingPlayerIndex - 1]);
  }

  getLastPlayerToAct() {
    return this.lastPlayerToAct;
  }

  setNextPlayerToAct() {
    const playerIndex = this.activePlayers.findIndex(
      (p) => p.id === this.playerToAct.id
    );

    this.playerToAct =
      playerIndex === this.activePlayers.length - 1
        ? this.activePlayers[0]
        : this.activePlayers[playerIndex + 1];
  }

  getNextPlayerToAct() {
    return this.playerToAct;
  }

  setFirstAndLastPlayerToAct() {
    const dealerButtonIndex = this.activePlayers.findIndex(
      (p) => p.hasDealerButton
    );

    const playersAfterDealer = this.activePlayers.slice(dealerButtonIndex + 1);
    const playersBeforeDealer = this.activePlayers.slice(
      0,
      dealerButtonIndex + 1
    );

    const reArrangedPlayers = [...playersAfterDealer, ...playersBeforeDealer];
    this.lastPlayerToAct = reArrangedPlayers[1];

    if (reArrangedPlayers.length === 2) {
      this.playerToAct = reArrangedPlayers[0];
    } else {
      this.playerToAct = reArrangedPlayers[2];
    }
  }
}

module.exports = {
  PlayerManager,
};
