const { Player, Room } = require("../classes/gameClasses");

const games = [];

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
