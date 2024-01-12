const generateID = require("../utils/generateID");

class Room {
  constructor(name, maxPlayers) {
    this.id = generateID();
    this.name = name;
    this.maxPlayers = maxPlayers;
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(playerId) {
    this.players = this.players.filter((p) => p.id !== playerId);
  }
}

class Player {
  constructor(name, chips) {
    this.id = generateID();
    this.name = name;
    this.chips = chips;
  }
}

module.exports = {
  Room,
  Player,
};
