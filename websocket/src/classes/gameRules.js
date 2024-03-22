class GameRules {
  constructor(limit, smallBlind, bigBlind, maxPlayers, raiseCountLimit) {
    this.limit = limit;
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.raiseCountLimit = raiseCountLimit;
    this.maxPlayers = maxPlayers;
  }

  getRules() {
    return {
      limit: this.limit,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
      maxPlayers: this.maxPlayers,
      raiseCountLimit: this.raiseCountLimit,
    };
  }
}

module.exports = GameRules;
