class Table {
  constructor(id, maxPlayers, limit, stakes) {
    this.id = id;
    this.maxPlayers = maxPlayers;
    this.limit = limit;
    this.stakes = stakes;
    this.players = [];
  }

  isTableFull() {
    return this.players.length >= this.maxPlayers;
  }

  addPlayer(player) {
    if (this.players.length > this.maxPlayers)
      throw new Error("Table has more players than allowed.");

    if (this.players.length < this.maxPlayers) {
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
}

const createEmptyTable = (id, maxPlayers, limit, stakes) =>
  new Table(id, maxPlayers, limit, stakes);

module.exports = {
  createEmptyTable,
};
