const { Player, Room } = require("../classes/gameClasses");

const games = [
  {
    id: "1",
    name: "Game 1",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
  {
    id: "2",
    name: "Game 2",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
  {
    id: "3",
    name: "Game 3",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
  {
    id: "4",
    name: "Game 4",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
  {
    id: "5",
    name: "Game 5",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
  {
    id: "6",
    name: "Game 6",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
  {
    id: "7",
    name: "Game 7",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
  {
    id: "8",
    name: "Game 8",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
  {
    id: "9",
    name: "Game 9",
    limit: "Fix",
    stakes: "0.1$ / 0.2$",
    maxPlayers: 9,
    players: [],
  },
];

const createGame = (roomName) => {
  const room = new Room(roomName);
  games.push(room);
};

const joinGame = (joinRequest) => {
  const player = createPlayer(joinRequest.playerName, joinRequest.chips);
  const game = findGame(joinRequest.gameId);

  if (game) {
    game.addPlayer(player);
    return true;
  } else {
    return false;
  }
};

const getGames = () => games;

const createPlayer = (playerName, chips) => {
  const player = new Player(playerName, chips);
  return player;
};

const findGame = (gameId) => {
  const game = games.find((game) => game.id === gameId);
  return game;
};

module.exports = {
  games,
  createGame,
  joinGame,
  getGames,
};
