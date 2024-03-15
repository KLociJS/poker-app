class GameRules {
  constructor(limit, steaks, maxPlayers) {
    this.limit = limit;
    this.steaks = steaks;
    this.maxPlayers = maxPlayers;
  }

  getRules() {
    return {
      limit: this.limit,
      steaks: this.steaks,
      maxPlayers: this.maxPlayers,
    };
  }
}

module.exports = {
  GameRules,
};
