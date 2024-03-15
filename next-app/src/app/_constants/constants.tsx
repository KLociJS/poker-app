export const ROUTES = {
  LOBBY: { HREF: "/lobby", LABEL: "Lobby" },
  TABLE: { HREF: "/table/", LABEL: "Table" },
};

export const SOCKET_EVENTS = {
  GET_TABLES: "getTables",
  UPDATE_LOBBY_TABLES: "updateLobbyTables",
  JOIN_TABLE: "joinTable",
  JOIN_LOBBY: "joinLobby",
  GET_PLAYERID: "getPlayerId",
  UPDATE_TABLE: "updateTable",
  TABLE_IS_FULL: "tableIsFull",
  PLAYER_ACTION: "playerAction",
};

export const GAME_MODE = {
  STAKES: ["all", "1/2", "10/20", "25/50"],
  LIMIT: ["all", "no limit", "pot limit", "fix limit"],
  MAX_PLAYERS: ["all", "2", "3", "4", "5", "6", "7", "8", "9"],
};
