const GAME_MODE = require("../constants/gameMode");
const generateID = require("../utils/generateID");
const { createPlayer } = require("./player");
const { createEmptyTable } = require("./table");

class PokerLobby {
  constructor() {
    this.players = [];
    this.tables = [];
  }

  addPlayer(id, userName) {
    const player = createPlayer(userName, id);
    this.players.push(player);
  }

  removePlayer(playerId) {
    const playerToRemove = this.players.find((p) => p.id === playerId);
    if (!playerToRemove) throw new Error("Player not found, cannot be removed");

    this.players = this.players.filter((p) => p.id !== playerId);
  }

  getPlayerById(playerId) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Player not found");

    return player;
  }

  addTable(table) {
    this.tables.push(table);
  }

  removeTableById(tableId) {
    const tableToRemove = this.tables.find((t) => t.id === tableId);
    if (!tableToRemove) throw new Error("Table not found, cannot be removed");

    this.tables = this.tables.filter((t) => t.id !== tableId);
  }

  getTables() {
    return this.tables;
  }

  findTableById(tableId) {
    const table = this.tables.find((t) => t.id === tableId);
    if (!table) throw new Error("Table not found");

    return table;
  }
}

const InitPokerLobby = () => {
  const lobby = new PokerLobby();

  // Create tables for each game mode
  GAME_MODE.LIMIT.forEach((limit) => {
    GAME_MODE.STAKE.forEach((stake) => {
      for (let i = 2; i < 10; i++) {
        const id = generateID();
        const table = createEmptyTable(id, i, limit, stake);
        lobby.addTable(table);
      }
    });
  });

  return lobby;
};

module.exports = InitPokerLobby;
