const { SOCKET_EVENTS } = require("../constants/socketEvents");
const generateID = require("../utils/generateID");

const handleJoinLobbyEvent = (data, socket, pokerLobby) => {
  const { userName } = data;
  const playerId = generateID();
  pokerLobby.addPlayer(playerId, userName);

  socket.emit(SOCKET_EVENTS.GET_PLAYERID, playerId);
  socket.join("lobby");

  const tables = pokerLobby.getTables();
  socket.emit(SOCKET_EVENTS.GET_TABLES, tables);
};

const handleJoinTableEvent = (data, socket, io, pokerLobby) => {
  const { playerId, tableId } = data;

  const table = pokerLobby.findTableById(tableId);

  const isFull = table.isTableFull();
  if (isFull) {
    socket.emit(SOCKET_EVENTS.TABLE_IS_FULL);
  }
  const player = pokerLobby.getPlayerById(playerId);
  player.setChips(1000);
  table.addPlayer(player);

  socket.join(`table${tableId}`);
  io.to(`table${tableId}`).emit(SOCKET_EVENTS.UPDATE_TABLE, table);

  const tables = pokerLobby.getTables();
  io.to("lobby").emit(SOCKET_EVENTS.UPDATE_LOBBY_TABLES, tables);
  socket.leave("lobby");
  pokerLobby.removePlayer(playerId);
};

module.exports = {
  handleJoinLobbyEvent,
  handleJoinTableEvent,
};
