const SOCKET_EVENTS = {
  JOIN_LOBBY: "joinLobby",
  GET_TABLES: "getTables",
  UPDATE_LOBBY_TABLES: "updateLobbyTables",
  UPDATE_TABLE: "updateTable",
  JOIN_TABLE: "joinTable",
  TABLE_IS_FULL: "tableIsFull",
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  GET_PLAYERID: "getPlayerId",
  PLAYER_ACTION: "playerAction",
};

module.exports = {
  SOCKET_EVENTS,
};
