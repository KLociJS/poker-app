class GameRules {
  constructor(limit, smallBlind, bigBlind, maxPlayers) {
    this.limit = limit;
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.maxPlayers = maxPlayers;
  }

  getRules() {
    return {
      limit: this.limit,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
      maxPlayers: this.maxPlayers,
    };
  }
}

module.exports = GameRules;
